import {
  HUE_SHIFT_MIN_DEG,
  HUE_SHIFT_RANGE_DEG,
  PALETTE_COUNT,
  WAITING_BUBBLE_DURATION_SEC,
} from '../constants';
import type {
  Character,
  FurnitureInstance,
  OfficeLayout,
  Seat,
  TileType as TileTypeVal,
} from '../types';
import { CharacterState, Direction, MATRIX_EFFECT_DURATION } from '../types';

import {
  createDefaultLayout,
  getBlockedTiles,
  layoutToFurnitureInstances,
  layoutToSeats,
  layoutToTileMap,
} from '../layout/layout-serializer';
import { findPath, getWalkableTiles, isWalkable } from '../layout/tile-map';
import { createCharacter, tileCenter, updateCharacter } from './characters';

function matrixEffectSeeds(): number[] {
  return Array.from({ length: 16 }, () => Math.random());
}

function startDespawn(ch: Character): void {
  ch.matrixEffect = 'despawn';
  ch.matrixEffectTimer = 0;
  ch.matrixEffectSeeds = matrixEffectSeeds();
  ch.bubbleType = null;
}

export class OfficeState {
  layout: OfficeLayout;
  tileMap: TileTypeVal[][];
  seats: Map<string, Seat>;
  blockedTiles: Set<string>;
  furniture: FurnitureInstance[];
  walkableTiles: Array<{ col: number; row: number }>;
  characters: Map<number, Character> = new Map();
  selectedAgentId: number | null = null;
  hoveredAgentId: number | null = null;
  subagentIdMap: Map<string, number> = new Map();
  subagentMeta: Map<number, { parentAgentId: number; parentToolId: string }> = new Map();
  private nextSubagentId = -1;

  constructor(layout?: OfficeLayout) {
    this.layout = layout ?? createDefaultLayout();
    this.tileMap = layoutToTileMap(this.layout);
    this.seats = layoutToSeats(this.layout.furniture);
    this.blockedTiles = getBlockedTiles(this.layout.furniture);
    this.furniture = layoutToFurnitureInstances(this.layout.furniture);
    this.walkableTiles = getWalkableTiles(this.tileMap, this.blockedTiles);
  }

  private ownSeatKey(ch: Character): string | null {
    if (!ch.seatId) return null;
    const seat = this.seats.get(ch.seatId);
    if (!seat) return null;
    return `${seat.seatCol},${seat.seatRow}`;
  }

  private unassignSeats(ch: Character): void {
    if (ch.seatId) {
      const seat = this.seats.get(ch.seatId);
      if (seat) seat.assigned = false;
    }
    if (ch.loungeSeatId) {
      const lounge = this.seats.get(ch.loungeSeatId);
      if (lounge) lounge.assigned = false;
    }
  }

  private placeCharacterAtSeat(ch: Character, seat: Seat): void {
    const pos = tileCenter(seat.seatCol, seat.seatRow);
    ch.tileCol = seat.seatCol;
    ch.tileRow = seat.seatRow;
    ch.x = pos.x;
    ch.y = pos.y;
    ch.dir = seat.facingDir;
  }

  private withOwnSeatUnblocked<T>(ch: Character, fn: () => T): T {
    const key = this.ownSeatKey(ch);
    if (key) this.blockedTiles.delete(key);
    const result = fn();
    if (key) this.blockedTiles.add(key);
    return result;
  }

  private findFreeSeat(loungeOnly = false): string | null {
    for (const [uid, seat] of this.seats) {
      if (seat.assigned) continue;
      const isLounge = uid.startsWith('lc-');
      if (loungeOnly ? isLounge : !isLounge) return uid;
    }
    return null;
  }

  private pickDiversePalette(): { palette: number; hueShift: number } {
    const counts = new Array(PALETTE_COUNT).fill(0) as number[];
    for (const ch of this.characters.values()) {
      if (ch.isSubagent) continue;
      counts[ch.palette] = (counts[ch.palette] ?? 0) + 1;
    }
    const minCount = Math.min(...counts);
    const available: number[] = [];
    for (let i = 0; i < PALETTE_COUNT; i++) {
      if (counts[i] === minCount) available.push(i);
    }
    const palette = available[Math.floor(Math.random() * available.length)] ?? 0;
    let hueShift = 0;
    if (minCount > 0) {
      hueShift = HUE_SHIFT_MIN_DEG + Math.floor(Math.random() * HUE_SHIFT_RANGE_DEG);
    }
    return { palette, hueShift };
  }

  /** 레이아웃 오른쪽 구역(회의실) walkable 타일 반환 */
  private getLoungeSpawn(): { col: number; row: number } {
    const midCol = Math.floor(this.layout.cols * 0.6);
    const lounge = this.walkableTiles.filter((t) => t.col > midCol);
    if (lounge.length > 0) return lounge[Math.floor(Math.random() * lounge.length)]!;
    if (this.walkableTiles.length > 0)
      return this.walkableTiles[Math.floor(Math.random() * this.walkableTiles.length)]!;
    return { col: 1, row: 1 };
  }

  addAgent(
    id: number,
    opts: {
      palette?: number;
      hueShift?: number;
      seatId?: string;
      skipSpawnEffect?: boolean;
      folderName?: string;
    } = {},
  ): void {
    if (this.characters.has(id)) return;

    let palette: number;
    let hueShift: number;
    if (opts.palette !== undefined) {
      palette = opts.palette;
      hueShift = opts.hueShift ?? 0;
    } else {
      const pick = this.pickDiversePalette();
      palette = pick.palette;
      hueShift = pick.hueShift;
    }

    // 업무 자리 배정 (work seat)
    let seatId: string | null = null;
    if (opts.seatId && this.seats.has(opts.seatId)) {
      const seat = this.seats.get(opts.seatId)!;
      if (!seat.assigned) seatId = opts.seatId;
    }
    if (!seatId) seatId = this.findFreeSeat(false);
    if (seatId) this.seats.get(seatId)!.assigned = true;

    // 대기 자리 배정 (lounge seat) — 스폰 위치
    const loungeSeatId = this.findFreeSeat(true);
    if (loungeSeatId) this.seats.get(loungeSeatId)!.assigned = true;
    const loungeSeat = loungeSeatId ? this.seats.get(loungeSeatId)! : null;

    const spawnPos = loungeSeat
      ? tileCenter(loungeSeat.seatCol, loungeSeat.seatRow)
      : tileCenter(Math.floor(this.layout.cols * 0.8), Math.floor(this.layout.rows / 2));

    const ch = createCharacter(id, palette, seatId, null, hueShift);
    ch.x = spawnPos.x;
    ch.y = spawnPos.y;
    ch.tileCol = loungeSeat?.seatCol ?? Math.floor(this.layout.cols * 0.8);
    ch.tileRow = loungeSeat?.seatRow ?? Math.floor(this.layout.rows / 2);
    ch.loungeSeatId = loungeSeatId;
    ch.state = CharacterState.TYPE;
    ch.dir = loungeSeat ? loungeSeat.facingDir : Direction.DOWN;
    ch.isActive = false;

    if (opts.folderName) ch.folderName = opts.folderName;
    if (!opts.skipSpawnEffect) {
      ch.matrixEffect = 'spawn';
      ch.matrixEffectTimer = 0;
      ch.matrixEffectSeeds = matrixEffectSeeds();
    }
    this.characters.set(id, ch);
  }

  removeAgent(id: number): void {
    const ch = this.characters.get(id);
    if (!ch) return;
    if (ch.matrixEffect === 'despawn') return;
    this.unassignSeats(ch);
    if (this.selectedAgentId === id) this.selectedAgentId = null;
    startDespawn(ch);
  }

  addSubagent(parentAgentId: number, parentToolId: string): number {
    const key = `${parentAgentId}:${parentToolId}`;
    if (this.subagentIdMap.has(key)) return this.subagentIdMap.get(key)!;

    const id = this.nextSubagentId--;
    const parentCh = this.characters.get(parentAgentId);
    const palette = parentCh ? parentCh.palette : 0;
    const hueShift = parentCh ? parentCh.hueShift : 0;

    const seatId = this.findFreeSeat();
    let ch: Character;
    if (seatId) {
      const seat = this.seats.get(seatId)!;
      seat.assigned = true;
      ch = createCharacter(id, palette, seatId, seat, hueShift);
    } else {
      const spawn = this.walkableTiles[0] ?? { col: 1, row: 1 };
      ch = createCharacter(id, palette, null, null, hueShift);
      const spawnPos = tileCenter(spawn.col, spawn.row);
      ch.x = spawnPos.x;
      ch.y = spawnPos.y;
      ch.tileCol = spawn.col;
      ch.tileRow = spawn.row;
    }

    ch.isSubagent = true;
    ch.parentAgentId = parentAgentId;
    ch.matrixEffect = 'spawn';
    ch.matrixEffectTimer = 0;
    ch.matrixEffectSeeds = matrixEffectSeeds();
    this.characters.set(id, ch);
    this.subagentIdMap.set(key, id);
    this.subagentMeta.set(id, { parentAgentId, parentToolId });
    return id;
  }

  removeSubagent(parentAgentId: number, parentToolId: string): void {
    const key = `${parentAgentId}:${parentToolId}`;
    const id = this.subagentIdMap.get(key);
    if (id === undefined) return;
    this.despawnSubagentById(id);
    this.subagentIdMap.delete(key);
  }

  removeAllSubagents(parentAgentId: number): void {
    const toRemove: string[] = [];
    for (const [key, id] of this.subagentIdMap) {
      const meta = this.subagentMeta.get(id);
      if (meta?.parentAgentId !== parentAgentId) continue;
      this.despawnSubagentById(id);
      toRemove.push(key);
    }
    for (const key of toRemove) {
      this.subagentIdMap.delete(key);
    }
  }

  private despawnSubagentById(id: number): void {
    const ch = this.characters.get(id);
    if (ch) {
      if (ch.seatId) {
        const seat = this.seats.get(ch.seatId);
        if (seat) seat.assigned = false;
      }
      startDespawn(ch);
    }
    this.subagentMeta.delete(id);
    if (this.selectedAgentId === id) this.selectedAgentId = null;
  }

  getSubagentId(parentAgentId: number, parentToolId: string): number | null {
    return this.subagentIdMap.get(`${parentAgentId}:${parentToolId}`) ?? null;
  }

  setAgentActive(id: number, active: boolean): void {
    const ch = this.characters.get(id);
    if (!ch) return;
    ch.isActive = active;
    if (!active) {
      // 이동 중이면 경로를 유지 — 도착 후 상태 전환은 characters.ts에서 처리
      if (ch.state !== CharacterState.WALK) {
        ch.path = [];
        ch.moveProgress = 0;
      }
    }
  }

  /** 도구 시작 시 캐릭터를 자기 자리(seat)로 이동 */
  moveAgentToWork(id: number): void {
    const ch = this.characters.get(id);
    if (!ch) return;
    ch.isActive = true;
    if (ch.matrixEffect) {
      // spawn 애니메이션 중이면 완료 후 이동하도록 기억
      ch.pendingWork = true;
      return;
    }
    if (!ch.seatId) return;

    const seat = this.seats.get(ch.seatId);
    if (!seat) return;
    if (ch.tileCol === seat.seatCol && ch.tileRow === seat.seatRow) {
      ch.state = CharacterState.TYPE;
      ch.dir = seat.facingDir;
      return;
    }

    // 자기 자리를 blocked에서 제외하고 경로 탐색
    const key = this.ownSeatKey(ch);
    if (key) this.blockedTiles.delete(key);

    // 현재 위치가 walkable하지 않으면 가장 가까운 walkable 타일로 보정
    let startCol = ch.tileCol;
    let startRow = ch.tileRow;
    if (!isWalkable(startCol, startRow, this.tileMap, this.blockedTiles)) {
      const nearest = this.walkableTiles.reduce(
        (best, t) => {
          const d = Math.abs(t.col - startCol) + Math.abs(t.row - startRow);
          const bd = Math.abs(best.col - startCol) + Math.abs(best.row - startRow);
          return d < bd ? t : best;
        },
        this.walkableTiles[0] ?? { col: 1, row: 1 },
      );
      startCol = nearest.col;
      startRow = nearest.row;
      const nearestPos = tileCenter(startCol, startRow);
      ch.tileCol = startCol;
      ch.tileRow = startRow;
      ch.x = nearestPos.x;
      ch.y = nearestPos.y;
    }

    const path = findPath(
      startCol,
      startRow,
      seat.seatCol,
      seat.seatRow,
      this.tileMap,
      this.blockedTiles,
    );

    if (key) this.blockedTiles.add(key);

    if (path.length > 0) {
      ch.path = path;
      ch.moveProgress = 0;
      ch.state = CharacterState.WALK;
      ch.frame = 0;
      ch.frameTimer = 0;
    } else {
      // 경로 없으면 즉시 자리에 앉힘
      this.placeCharacterAtSeat(ch, seat);
      ch.state = CharacterState.TYPE;
    }
  }

  setAgentTool(id: number, tool: string | null): void {
    const ch = this.characters.get(id);
    if (!ch) return;
    // 이동 중 tool 초기화(null)는 스킵 — 도착 후 말풍선이 자연스럽게 유지됨
    if (tool === null && ch.state === CharacterState.WALK) return;
    ch.currentTool = tool;
  }

  /** 도구 완료 후 캐릭터를 lounge seat으로 복귀 */
  returnAgentToSeat(id: number): void {
    const ch = this.characters.get(id);
    if (!ch || ch.matrixEffect) return;

    ch.isActive = false;

    // lounge seat이 없으면 빈 lounge seat 새로 배정
    if (!ch.loungeSeatId) {
      const newLounge = this.findFreeSeat(true);
      if (newLounge) {
        this.seats.get(newLounge)!.assigned = true;
        ch.loungeSeatId = newLounge;
      }
    }

    const loungeSeat = ch.loungeSeatId ? this.seats.get(ch.loungeSeatId) : null;
    if (!loungeSeat) return;

    // 이미 lounge seat에 있으면 그냥 앉힘
    if (ch.tileCol === loungeSeat.seatCol && ch.tileRow === loungeSeat.seatRow) {
      ch.state = CharacterState.TYPE;
      ch.dir = loungeSeat.facingDir;
      return;
    }

    const key = this.ownSeatKey(ch);
    if (key) this.blockedTiles.delete(key);

    // lounge seat이 blocked에 있을 경우에만 임시 해제
    const loungeKey = `${loungeSeat.seatCol},${loungeSeat.seatRow}`;
    const loungeWasBlocked = this.blockedTiles.has(loungeKey);
    if (loungeWasBlocked) this.blockedTiles.delete(loungeKey);

    const path = findPath(
      ch.tileCol,
      ch.tileRow,
      loungeSeat.seatCol,
      loungeSeat.seatRow,
      this.tileMap,
      this.blockedTiles,
    );

    if (key) this.blockedTiles.add(key);
    if (loungeWasBlocked) this.blockedTiles.add(loungeKey);

    if (path.length > 0) {
      ch.path = path;
      ch.moveProgress = 0;
      ch.state = CharacterState.WALK;
      ch.frame = 0;
      ch.frameTimer = 0;
    } else {
      // 경로 없으면 즉시 착석
      this.placeCharacterAtSeat(ch, loungeSeat);
      ch.state = CharacterState.TYPE;
    }
  }

  showPermissionBubble(id: number): void {
    const ch = this.characters.get(id);
    if (ch) {
      ch.bubbleType = 'permission';
      ch.bubbleTimer = 0;
    }
  }

  clearPermissionBubble(id: number): void {
    const ch = this.characters.get(id);
    if (ch?.bubbleType === 'permission') {
      ch.bubbleType = null;
      ch.bubbleTimer = 0;
    }
  }

  showWaitingBubble(id: number): void {
    const ch = this.characters.get(id);
    if (ch) {
      ch.bubbleType = 'waiting';
      ch.bubbleTimer = WAITING_BUBBLE_DURATION_SEC;
    }
  }

  update(dt: number): void {
    const toDelete: number[] = [];
    for (const ch of this.characters.values()) {
      if (ch.matrixEffect) {
        ch.matrixEffectTimer += dt;
        if (ch.matrixEffectTimer >= MATRIX_EFFECT_DURATION) {
          if (ch.matrixEffect === 'spawn') {
            ch.matrixEffect = null;
            ch.matrixEffectTimer = 0;
            ch.matrixEffectSeeds = [];
            if (ch.pendingWork) {
              ch.pendingWork = false;
              this.moveAgentToWork(ch.id);
            }
          } else {
            toDelete.push(ch.id);
          }
        }
        continue;
      }

      this.withOwnSeatUnblocked(ch, () =>
        updateCharacter(ch, dt, this.walkableTiles, this.seats, this.tileMap, this.blockedTiles),
      );

      if (ch.bubbleType === 'waiting') {
        ch.bubbleTimer -= dt;
        if (ch.bubbleTimer <= 0) {
          ch.bubbleType = null;
          ch.bubbleTimer = 0;
        }
      }
    }
    for (const id of toDelete) {
      this.characters.delete(id);
    }
  }

  getCharacters(): Character[] {
    return Array.from(this.characters.values());
  }
}
