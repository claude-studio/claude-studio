import type { Direction, SpriteData } from '../types';
import { Direction as Dir } from '../types';

const _ = ''; // transparent

// ── 6 Character Palettes (simplified pixel art) ──────────────────
// Each character is 16x24 pixels (sprite pixel art)
// Walking: 4 frames per direction (down, left, right, up)
// Typing: 2 frames per direction
// Reading: 2 frames per direction (same as typing with variation)

function makeWalkFrame(
  bodyColor: string,
  hairColor: string,
  skinColor: string,
  frameIdx: number,
  dir: Direction,
): SpriteData {
  const B = bodyColor;
  const H = hairColor;
  const S = skinColor;
  const legOffset = [0, 1, 0, -1][frameIdx % 4]!;

  if (dir === Dir.DOWN) {
    return [
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
      [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
      [_, _, _, _, H, H, S, S, S, S, H, H, _, _, _, _],
      [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
      [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
      [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
      [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
      [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
      [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
      [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
      [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
      [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
      [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
      [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    ];
  }

  // Simplified: same sprite for all directions with slight variation
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, _, _, H, H, S, S, S, S, H, H, _, _, _, _],
    [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
    [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
    [_, _, legOffset > 0 ? B : _, _, _, _, legOffset > 0 ? B : _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}

function makeTypeFrame(
  bodyColor: string,
  hairColor: string,
  skinColor: string,
  frameIdx: number,
): SpriteData {
  const B = bodyColor;
  const H = hairColor;
  const S = skinColor;
  const armY = frameIdx === 0 ? B : S;
  return [
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, H, H, H, H, H, H, _, _, _, _, _],
    [_, _, _, _, H, H, H, H, H, H, H, H, _, _, _, _],
    [_, _, _, _, H, H, S, S, S, S, H, H, _, _, _, _],
    [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, _, S, S, S, S, _, _, _, _, _, _],
    [_, _, _, _, _, B, B, B, B, B, B, _, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, armY, B, B, B, B, B, B, armY, _, _, _, _],
    [_, _, _, _, B, B, B, B, B, B, B, B, _, _, _, _],
    [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
    [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
    [_, _, _, _, B, B, _, _, _, _, B, B, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
    [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],
  ];
}

// 6 character palettes: [body, hair, skin]
const PALETTES: [string, string, string][] = [
  ['#4477CC', '#8B4513', '#FFCC99'], // blue shirt, brown hair
  ['#CC4444', '#2F2F2F', '#FFCC99'], // red shirt, dark hair
  ['#44AA66', '#AA7700', '#FFCC99'], // green shirt, blonde
  ['#AA44AA', '#5533AA', '#FFCC99'], // purple shirt, purple hair
  ['#CC8844', '#222222', '#FFCC99'], // orange shirt, black hair
  ['#44AACC', '#884422', '#FFCC99'], // cyan shirt, auburn hair
];

export interface CharacterSprites {
  walk: Record<Direction, SpriteData[]>;    // 5 frames (0→1→2→1→0)
  stand: Record<Direction, SpriteData>;     // 1 frame (1) — 서있기
  idle: Record<Direction, SpriteData[]>;    // 2 frames (3, 4) — 앉기 대기
  typing: Record<Direction, SpriteData[]>;  // 2 frames (5, 6)
  reading: Record<Direction, SpriteData[]>; // 2 frames (5, 6)
}

let characterTemplates: CharacterSprites[] | null = null;

/** Called when extension loads external sprite sheets */
export function setCharacterTemplates(raw: Array<{ down: string[][][]; up: string[][][]; right: string[][][] }>): void {
  characterTemplates = raw.map((ch) => {
    const downFrames = ch.down.map((f) => f as SpriteData);
    const upFrames = ch.up.map((f) => f as SpriteData);
    const rightFrames = ch.right.map((f) => f as SpriteData);
    // Mirror right for left
    const leftFrames = rightFrames.map((frame) =>
      frame.map((row) => [...row].reverse()),
    );

    // frame 0: 걷기A, frame 1: 정면(서있기), frame 2: 걷기B
    // frame 3~4: 앉기 idle, frame 5~6: 앉기 작업중
    // 걷기 순서: 0→1→2→1→0 루프
    const walkSeq = (frames: SpriteData[]) => [
      frames[0]!, frames[1]!, frames[2]!, frames[1]!, frames[0]!,
    ];
    // idle 앉기: frame 3, 4
    const idleSeq = (frames: SpriteData[]) => [frames[3]!, frames[4]!];
    // 작업중 앉기: frame 5, 6
    const workSeq = (frames: SpriteData[]) => [frames[5]!, frames[6]!];

    return {
      walk: {
        [Dir.DOWN]:  walkSeq(downFrames),
        [Dir.UP]:    walkSeq(upFrames),
        [Dir.RIGHT]: walkSeq(rightFrames),
        [Dir.LEFT]:  walkSeq(leftFrames),
      },
      stand: {
        [Dir.DOWN]:  downFrames[1]!,
        [Dir.UP]:    upFrames[1]!,
        [Dir.RIGHT]: rightFrames[1]!,
        [Dir.LEFT]:  leftFrames[1]!,
      },
      idle: {
        [Dir.DOWN]:  idleSeq(downFrames),
        [Dir.UP]:    idleSeq(upFrames),
        [Dir.RIGHT]: idleSeq(rightFrames),
        [Dir.LEFT]:  idleSeq(leftFrames),
      },
      typing: {
        [Dir.DOWN]:  workSeq(downFrames),
        [Dir.UP]:    workSeq(upFrames),
        [Dir.RIGHT]: workSeq(rightFrames),
        [Dir.LEFT]:  workSeq(leftFrames),
      },
      reading: {
        [Dir.DOWN]:  workSeq(downFrames),
        [Dir.UP]:    workSeq(upFrames),
        [Dir.RIGHT]: workSeq(rightFrames),
        [Dir.LEFT]:  workSeq(leftFrames),
      },
    };
  });
}

function buildBuiltinSprites(paletteIdx: number): CharacterSprites {
  const [body, hair, skin] = PALETTES[paletteIdx % PALETTES.length]!;
  const dirs: Direction[] = [Dir.DOWN, Dir.LEFT, Dir.RIGHT, Dir.UP];
  const walkFrames: Record<Direction, SpriteData[]> = {} as Record<Direction, SpriteData[]>;
  const typeFrames: Record<Direction, SpriteData[]> = {} as Record<Direction, SpriteData[]>;
  const readFrames: Record<Direction, SpriteData[]> = {} as Record<Direction, SpriteData[]>;

  const standFrames: Record<Direction, SpriteData> = {} as Record<Direction, SpriteData>;
  const idleFrames: Record<Direction, SpriteData[]> = {} as Record<Direction, SpriteData[]>;
  for (const dir of dirs) {
    walkFrames[dir] = [0, 1, 2, 3].map((i) => makeWalkFrame(body, hair, skin, i, dir));
    standFrames[dir] = makeWalkFrame(body, hair, skin, 0, dir);
    idleFrames[dir] = [0, 1].map((i) => makeTypeFrame(body, hair, skin, i));
    typeFrames[dir] = [0, 1].map((i) => makeTypeFrame(body, hair, skin, i));
    readFrames[dir] = [0, 1].map((i) => makeTypeFrame(hair, body, skin, i));
  }

  return { walk: walkFrames, stand: standFrames, idle: idleFrames, typing: typeFrames, reading: readFrames };
}

const builtinCache: CharacterSprites[] = [];

export function getCharacterSprites(paletteIdx: number, hueShift = 0): CharacterSprites {
  const idx = paletteIdx % PALETTES.length;
  if (characterTemplates && characterTemplates[idx]) {
    return characterTemplates[idx]!;
  }
  if (!builtinCache[idx]) {
    builtinCache[idx] = buildBuiltinSprites(idx);
  }
  return builtinCache[idx]!;
}

// Speech bubble sprites (simple pixel art)
export const BUBBLE_PERMISSION_SPRITE: SpriteData = [
  [_, '#FFCC00', '#FFCC00', '#FFCC00', '#FFCC00', '#FFCC00', _],
  ['#FFCC00', '#FFFFFF', '#FFFFFF', '#FF0000', '#FFFFFF', '#FFFFFF', '#FFCC00'],
  ['#FFCC00', '#FFFFFF', '#FF0000', '#FF0000', '#FF0000', '#FFFFFF', '#FFCC00'],
  ['#FFCC00', '#FFFFFF', '#FFFFFF', '#FF0000', '#FFFFFF', '#FFFFFF', '#FFCC00'],
  ['#FFCC00', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFFFFF', '#FFCC00'],
  ['#FFCC00', '#FFFFFF', '#FFFFFF', '#FF0000', '#FFFFFF', '#FFFFFF', '#FFCC00'],
  [_, '#FFCC00', '#FFCC00', '#FFCC00', '#FFCC00', '#FFCC00', _],
];

export const BUBBLE_WAITING_SPRITE: SpriteData = [
  [_, '#88BBFF', '#88BBFF', '#88BBFF', '#88BBFF', '#88BBFF', _],
  ['#88BBFF', '#FFFFFF', '#88BBFF', '#FFFFFF', '#88BBFF', '#FFFFFF', '#88BBFF'],
  ['#88BBFF', '#88BBFF', '#FFFFFF', '#88BBFF', '#FFFFFF', '#88BBFF', '#88BBFF'],
  [_, '#88BBFF', '#88BBFF', '#88BBFF', '#88BBFF', '#88BBFF', _],
];
