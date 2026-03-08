import {
  SEAT_REST_MAX_SEC,
  SEAT_REST_MIN_SEC,
  TYPE_FRAME_DURATION_SEC,
  WALK_FRAME_DURATION_SEC,
  WALK_SPEED_PX_PER_SEC,
  WANDER_MOVES_BEFORE_REST_MAX,
  WANDER_MOVES_BEFORE_REST_MIN,
  WANDER_PAUSE_MAX_SEC,
  WANDER_PAUSE_MIN_SEC,
} from '../constants';
import { findPath } from '../layout/tile-map';
import type { CharacterSprites } from '../sprites/sprite-data';
import type { Character, Seat, SpriteData, TileType as TileTypeVal } from '../types';
import { CharacterState, Direction, TILE_SIZE } from '../types';

const READING_TOOLS = new Set(['Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch']);

export function isReadingTool(tool: string | null): boolean {
  if (!tool) return false;
  return READING_TOOLS.has(tool);
}

export function tileCenter(col: number, row: number): { x: number; y: number } {
  return {
    x: col * TILE_SIZE + TILE_SIZE / 2,
    y: row * TILE_SIZE + TILE_SIZE / 2,
  };
}

function directionBetween(fromCol: number, fromRow: number, toCol: number, toRow: number): Direction {
  const dc = toCol - fromCol;
  const dr = toRow - fromRow;
  if (dc > 0) return Direction.RIGHT;
  if (dc < 0) return Direction.LEFT;
  if (dr > 0) return Direction.DOWN;
  return Direction.UP;
}

export function createCharacter(
  id: number,
  palette: number,
  seatId: string | null,
  seat: Seat | null,
  hueShift = 0,
): Character {
  const col = seat ? seat.seatCol : 1;
  const row = seat ? seat.seatRow : 1;
  const center = tileCenter(col, row);
  return {
    id,
    state: CharacterState.TYPE,
    dir: seat ? seat.facingDir : Direction.DOWN,
    x: center.x,
    y: center.y,
    tileCol: col,
    tileRow: row,
    path: [],
    moveProgress: 0,
    currentTool: null,
    palette,
    hueShift,
    frame: 0,
    frameTimer: 0,
    wanderTimer: 0,
    wanderCount: 0,
    wanderLimit: randomInt(WANDER_MOVES_BEFORE_REST_MIN, WANDER_MOVES_BEFORE_REST_MAX),
    isActive: true,
    seatId,
    bubbleType: null,
    bubbleTimer: 0,
    seatTimer: 0,
    isSubagent: false,
    parentAgentId: null,
    matrixEffect: null,
    matrixEffectTimer: 0,
    matrixEffectSeeds: [],
    pendingWork: false,
    loungeSeatId: null,
  };
}

export function updateCharacter(
  ch: Character,
  dt: number,
  walkableTiles: Array<{ col: number; row: number }>,
  seats: Map<string, Seat>,
  tileMap: TileTypeVal[][],
  blockedTiles: Set<string>,
): void {
  ch.frameTimer += dt;

  switch (ch.state) {
    case CharacterState.TYPE: {
      if (ch.frameTimer >= TYPE_FRAME_DURATION_SEC) {
        ch.frameTimer -= TYPE_FRAME_DURATION_SEC;
        ch.frame = (ch.frame + 1) % 2;
      }
      if (!ch.isActive) {
        if (ch.seatTimer > 0) {
          ch.seatTimer -= dt;
          break;
        }
        ch.seatTimer = 0;
        ch.state = CharacterState.IDLE;
        ch.frame = 0;
        ch.frameTimer = 0;
        ch.wanderTimer = randomRange(WANDER_PAUSE_MIN_SEC, WANDER_PAUSE_MAX_SEC);
        ch.wanderCount = 0;
        ch.wanderLimit = randomInt(WANDER_MOVES_BEFORE_REST_MIN, WANDER_MOVES_BEFORE_REST_MAX);
      }
      break;
    }

    case CharacterState.IDLE: {
      // 회의실 서있기 — 정면(DOWN) 고정
      ch.frame = 0;
      ch.dir = Direction.DOWN;
      break;
    }

    case CharacterState.WALK: {
      if (ch.frameTimer >= WALK_FRAME_DURATION_SEC) {
        ch.frameTimer -= WALK_FRAME_DURATION_SEC;
        ch.frame = (ch.frame + 1) % 5;
      }

      if (ch.path.length === 0) {
        const center = tileCenter(ch.tileCol, ch.tileRow);
        ch.x = center.x;
        ch.y = center.y;

        if (ch.isActive) {
          // 작업 중 — 자리에 도착하면 TYPE, 아니면 계속 이동
          if (ch.seatId) {
            const seat = seats.get(ch.seatId);
            if (!seat) {
              ch.state = CharacterState.TYPE;
            } else if (ch.tileCol === seat.seatCol && ch.tileRow === seat.seatRow) {
              ch.state = CharacterState.TYPE;
              ch.dir = seat.facingDir;
            } else {
              // 아직 자리가 아님 — 경로 재탐색
              const newPath = findPath(ch.tileCol, ch.tileRow, seat.seatCol, seat.seatRow, tileMap, blockedTiles);
              if (newPath.length > 0) {
                ch.path = newPath;
                ch.moveProgress = 0;
                break;
              }
              // 경로도 없으면 즉시 착석
              ch.state = CharacterState.TYPE;
              ch.dir = seat.facingDir;
            }
          } else {
            ch.state = CharacterState.TYPE;
          }
        } else {
          // isActive=false — lounge seat 또는 work seat 도착 체크
          const loungeSeat = ch.loungeSeatId ? seats.get(ch.loungeSeatId) : null;
          if (loungeSeat && ch.tileCol === loungeSeat.seatCol && ch.tileRow === loungeSeat.seatRow) {
            ch.state = CharacterState.TYPE;
            ch.dir = loungeSeat.facingDir;
          } else {
            ch.state = CharacterState.IDLE;
          }
        }
        ch.frame = 0;
        ch.frameTimer = 0;
        break;
      }

      const nextTile = ch.path[0]!;
      ch.dir = directionBetween(ch.tileCol, ch.tileRow, nextTile.col, nextTile.row);
      ch.moveProgress += (WALK_SPEED_PX_PER_SEC / TILE_SIZE) * dt;

      const fromCenter = tileCenter(ch.tileCol, ch.tileRow);
      const toCenter = tileCenter(nextTile.col, nextTile.row);
      const t = Math.min(ch.moveProgress, 1);
      ch.x = fromCenter.x + (toCenter.x - fromCenter.x) * t;
      ch.y = fromCenter.y + (toCenter.y - fromCenter.y) * t;

      if (ch.moveProgress >= 1) {
        ch.tileCol = nextTile.col;
        ch.tileRow = nextTile.row;
        ch.x = toCenter.x;
        ch.y = toCenter.y;
        ch.path.shift();
        ch.moveProgress = 0;
      }

      if (ch.isActive && ch.seatId) {
        const seat = seats.get(ch.seatId);
        if (seat) {
          const lastStep = ch.path[ch.path.length - 1];
          if (!lastStep || lastStep.col !== seat.seatCol || lastStep.row !== seat.seatRow) {
            const newPath = findPath(ch.tileCol, ch.tileRow, seat.seatCol, seat.seatRow, tileMap, blockedTiles);
            if (newPath.length > 0) {
              ch.path = newPath;
              ch.moveProgress = 0;
            }
          }
        }
      }
      break;
    }
  }
}

export function getCharacterSprite(ch: Character, sprites: CharacterSprites): SpriteData {
  switch (ch.state) {
    case CharacterState.TYPE: {
      if (ch.isActive) {
        // 작업 중: typing/reading frame 5~6 반복 (frame % 2)
        const workFrames = isReadingTool(ch.currentTool) ? sprites.reading[ch.dir] : sprites.typing[ch.dir];
        return workFrames[ch.frame % 2]!;
      } else {
        // 대기(isActive=false): idle 앉기 frame 3~4 반복
        const idleSitFrames = sprites.idle[ch.dir];
        return idleSitFrames[ch.frame % 2]!;
      }
    }
    case CharacterState.WALK:
      return sprites.walk[ch.dir][ch.frame % 5]!;
    case CharacterState.IDLE: {
      // 회의실 서있기 — stand 프레임 (frame 1), 정면(DOWN)
      return sprites.stand[Direction.DOWN];
    }
    default:
      return sprites.walk[ch.dir][1]!;
  }
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}
