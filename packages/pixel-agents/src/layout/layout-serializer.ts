import type {
  Direction as DirectionType,
  FurnitureInstance,
  OfficeLayout,
  PlacedFurniture,
  Seat,
  TileType as TileTypeVal,
} from '../types';
import { Direction, FurnitureType, TILE_SIZE, TileType } from '../types';

// ── Sprites ──────────────────────────────────────────────────────

const SIMPLE_SPRITES: Record<string, string[][]> = {};

function solidSprite(color: string, w = TILE_SIZE, h = TILE_SIZE): string[][] {
  return Array.from(
    { length: h },
    (_, r) =>
      Array.from({ length: w }, (__, c) => {
        if (r === 0 || r === h - 1 || c === 0 || c === w - 1) return '#000000';
        return color;
      }) as string[],
  );
}

function getSimpleSprite(type: string): string[][] {
  if (!SIMPLE_SPRITES[type]) {
    const colors: Record<string, string> = {
      [FurnitureType.CHAIR]: '#6B3A2A',
      [FurnitureType.DESK]: '#A07828',
      [FurnitureType.PLANT]: '#3D8B37',
      [FurnitureType.LAMP]: '#CCCC44',
      [FurnitureType.BOOKSHELF]: '#7A5C2A',
      [FurnitureType.COOLER]: '#5599BB',
      [FurnitureType.WHITEBOARD]: '#DDDDDD',
      [FurnitureType.PC]: '#334455',
    };
    const color = colors[type] ?? '#666666';
    SIMPLE_SPRITES[type] = solidSprite(color);
  }
  return SIMPLE_SPRITES[type]!;
}

// ── Default Layout ────────────────────────────────────────────────
//
// 32 × 20 office, CD 구조 (마주보는 책상):
//
//  col:  0    5    10   15   17   22   27   31
//        ┌────────────────────────────────────┐  row 0
//        │ P  [CD pair A: 6쌍]           P   │  row 1
//        │    D  D  D  D  D  D  |            │  row 2  ← 책상 위
//        │    C  C  C  C  C  C  |  WB        │  row 3  ← 의자 (DOWN, 앞모습)
//        │    (통로)             |            │  row 4
//        │    C  C  C  C  C  C  |  [회의]    │  row 5  ← 의자 (UP, 앞모습)
//        │    D  D  D  D  D  D  |            │  row 6  ← 책상 아래
//        │                      |            │  row 7
//        │    [CD pair B: 6쌍]  |            │  row 8
//        │    D  D  D  D  D  D  |            │  row 9
//        │    C  C  C  C  C  C  |            │  row 10
//        │    (통로)             |            │  row 11
//        │    C  C  C  C  C  C  |            │  row 12
//        │    D  D  D  D  D  D  |            │  row 13
//        │                      |            │  row 14~19
//        └────────────────────────────────────┘  row 19
//
// 왼쪽 (col 1-15): CD 책상 구역 — 2세트 × 6쌍 = 24 seats
// 오른쪽 (col 17-30): 공동 작업 구역 — 화이트보드, 회의 테이블

export function createDefaultLayout(): OfficeLayout {
  // ── 레이아웃 ─────────────────────────────────────────────────
  // C D . C D . . C D . C D    (row r)  ← 의자가 왼쪽, 책상이 오른쪽, RIGHT 방향
  // 4쌍 그룹 / 통로 / 4쌍 그룹 — 두 행(row)
  // 오른쪽 구역: 공동 작업 (화이트보드, 회의 테이블)
  //
  // col:  0  1  2  3  4  5  6  7  8  9  10 11 12 13  14  15 16 ... 24 25
  //       ┌──────────────────────────────────────────────────────────────┐
  // row 0 █████████████████████████████████████████████████████████████████
  // row 1 █ P  C  D  C  D     C  D  C  D  │  WB                 L  BK █
  // row 2 █    C  D  C  D     C  D  C  D  │                        BK █
  // row 3 █    (통로)                       │     회의 테이블         BK █
  // row 4 █    C  D  C  D     C  D  C  D  │                        BK █
  // row 5 █    C  D  C  D     C  D  C  D  │                           █
  //       └──────────────────────────────────────────────────────────────┘

  const cols = 26;
  const rows = 14;
  const tiles: TileTypeVal[] = [];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r === 0 || r === rows - 1 || c === 0 || c === cols - 1) {
        tiles.push(TileType.WALL);
      } else if (c === 13 && r >= 1 && r <= rows - 2) {
        tiles.push(TileType.WALL);
      } else {
        tiles.push(TileType.FLOOR_1);
      }
    }
  }

  // 문: col 13, row 6-7
  tiles[6 * cols + 13] = TileType.FLOOR_1;
  tiles[7 * cols + 13] = TileType.FLOOR_1;

  const furniture: PlacedFurniture[] = [];
  let uid = 0;

  // ── CD 쌍 배치 헬퍼 ───────────────────────────────────────────
  // C(col) D(col+1) 패턴, 의자가 오른쪽(책상)을 향해 RIGHT 방향
  // pairs: 각 그룹의 C 위치 col 배열, rows: 앉는 행 배열
  const placeCDRow = (chairCols: number[], row: number, prefix: string) => {
    for (const cc of chairCols) {
      furniture.push({
        uid: `${prefix}-c-${cc}-${uid++}`,
        type: FurnitureType.CHAIR,
        col: cc,
        row,
      });
      furniture.push({
        uid: `${prefix}-d-${cc}-${uid++}`,
        type: FurnitureType.DESK,
        col: cc + 1,
        row,
      });
      furniture.push({
        uid: `${prefix}-pc-${cc}-${uid++}`,
        type: FurnitureType.PC,
        col: cc + 1,
        row,
      });
    }
  };

  // 그룹 A (col 1-5): C D . C D  → chair at 1,4 / desk at 2,5
  // 그룹 B (col 7-11): C D . C D → chair at 7,10 / desk at 8,11
  const groupA = [1, 4];
  const groupB = [7, 10];
  const chairCols = [...groupA, ...groupB];

  // 행 1, 2, 4, 5 (통로 = row 3)
  for (const row of [1, 2, 4, 5]) {
    placeCDRow(chairCols, row, `r${row}`);
  }

  // ── 왼쪽 장식 ─────────────────────────────────────────────────
  furniture.push({ uid: `cooler-${uid++}`, type: FurnitureType.COOLER, col: 1, row: 7 });
  furniture.push({ uid: `plant-a-${uid++}`, type: FurnitureType.PLANT, col: 1, row: 12 });
  furniture.push({ uid: `plant-b-${uid++}`, type: FurnitureType.PLANT, col: 11, row: 12 });
  furniture.push({ uid: `lamp-a-${uid++}`, type: FurnitureType.LAMP, col: 12, row: 3 });

  // ── 오른쪽 대기 구역 (col 14-24) — 업무 구역과 동일한 CD 구조 ──
  // C D . C D  (row r)  → lc- prefix로 lounge seat 등록
  // col: 14 C, 15 D, 17 C, 18 D, 20 C, 21 D, 22 C, 23 D
  const loungeChairCols = [14, 17, 20, 22];
  for (const row of [1, 2, 4, 5]) {
    for (const cc of loungeChairCols) {
      furniture.push({
        uid: `lc-c-${cc}-${row}-${uid++}`,
        type: FurnitureType.CHAIR,
        col: cc,
        row,
      });
      furniture.push({
        uid: `lc-d-${cc}-${row}-${uid++}`,
        type: FurnitureType.DESK,
        col: cc + 1,
        row,
      });
      furniture.push({
        uid: `lc-pc-${cc}-${row}-${uid++}`,
        type: FurnitureType.PC,
        col: cc + 1,
        row,
      });
    }
  }

  furniture.push({ uid: `plant-r0-${uid++}`, type: FurnitureType.PLANT, col: 14, row: 12 });
  furniture.push({ uid: `plant-r1-${uid++}`, type: FurnitureType.PLANT, col: 24, row: 12 });

  return { version: 1, cols, rows, tiles, furniture };
}

// ── Layout → Runtime ──────────────────────────────────────────────

export function layoutToTileMap(layout: OfficeLayout): TileTypeVal[][] {
  const map: TileTypeVal[][] = [];
  for (let r = 0; r < layout.rows; r++) {
    const row: TileTypeVal[] = [];
    for (let c = 0; c < layout.cols; c++) {
      row.push(layout.tiles[r * layout.cols + c] ?? TileType.FLOOR_1);
    }
    map.push(row);
  }
  return map;
}

export function layoutToFurnitureInstances(furniture: PlacedFurniture[]): FurnitureInstance[] {
  return furniture
    .map((item) => {
      const sprite = getSimpleSprite(item.type);
      const x = item.col * TILE_SIZE;
      const y = item.row * TILE_SIZE;
      return { sprite, x, y, zY: y + sprite.length };
    })
    .sort((a, b) => a.zY - b.zY);
}

export function layoutToSeats(furniture: PlacedFurniture[]): Map<string, Seat> {
  const seats = new Map<string, Seat>();

  // Build a set of desk positions for facingDir calculation
  const deskPositions = new Set<string>();
  for (const f of furniture) {
    if (f.type === FurnitureType.DESK) {
      deskPositions.add(`${f.col},${f.row}`);
    }
  }

  furniture
    .filter((f) => f.type === FurnitureType.CHAIR && !f.uid.startsWith('mc-'))
    .forEach((chair) => {
      // Determine facing direction toward the adjacent desk.
      // "Facing toward desk" means the character's front (DOWN sprite) is visible
      // when the desk is above/to-the-side, so we invert the offset.
      let facingDir: DirectionType = Direction.RIGHT;
      if (deskPositions.has(`${chair.col + 1},${chair.row}`))
        facingDir = Direction.RIGHT; // desk right → face right
      else if (deskPositions.has(`${chair.col - 1},${chair.row}`))
        facingDir = Direction.LEFT; // desk left → face left
      else if (deskPositions.has(`${chair.col},${chair.row - 1}`))
        facingDir = Direction.DOWN; // desk above → face down
      else if (deskPositions.has(`${chair.col},${chair.row + 1}`)) facingDir = Direction.UP; // desk below → face up

      seats.set(chair.uid, {
        uid: chair.uid,
        seatCol: chair.col,
        seatRow: chair.row,
        facingDir,
        assigned: false,
      });
    });

  return seats;
}

export function getBlockedTiles(furniture: PlacedFurniture[]): Set<string> {
  const blocked = new Set<string>();
  for (const item of furniture) {
    if (
      item.type === FurnitureType.DESK ||
      item.type === FurnitureType.BOOKSHELF ||
      item.type === FurnitureType.COOLER ||
      item.type === FurnitureType.WHITEBOARD
    ) {
      blocked.add(`${item.col},${item.row}`);
    }
  }
  return blocked;
}

export function migrateLayoutColors(layout: OfficeLayout): OfficeLayout {
  return layout;
}
