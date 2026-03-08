import * as fs from 'fs';
import * as path from 'path';
import { PNG } from 'pngjs';

// PNG layout: 7 frames × 16px wide, 3 directions × 32px tall = 112×96
const CHAR_COUNT = 6;
const CHAR_FRAME_W = 16;
const CHAR_FRAME_H = 32;
const CHAR_FRAMES_PER_ROW = 7;
const DIRECTIONS = ['down', 'up', 'right'] as const;
const ALPHA_THRESHOLD = 16;

type SpriteData = string[][];

interface CharacterDirectionSprites {
  down: SpriteData[];
  up: SpriteData[];
  right: SpriteData[];
}

function pngToFrames(png: PNG, dirIdx: number): SpriteData[] {
  const frames: SpriteData[] = [];
  const rowOffsetY = dirIdx * CHAR_FRAME_H;

  for (let f = 0; f < CHAR_FRAMES_PER_ROW; f++) {
    const sprite: SpriteData = [];
    const frameOffsetX = f * CHAR_FRAME_W;

    for (let y = 0; y < CHAR_FRAME_H; y++) {
      const row: string[] = [];
      for (let x = 0; x < CHAR_FRAME_W; x++) {
        const idx = ((rowOffsetY + y) * png.width + (frameOffsetX + x)) * 4;
        const r = png.data[idx]!;
        const g = png.data[idx + 1]!;
        const b = png.data[idx + 2]!;
        const a = png.data[idx + 3]!;
        if (a < ALPHA_THRESHOLD) {
          row.push('');
        } else {
          row.push(
            `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase(),
          );
        }
      }
      sprite.push(row);
    }
    frames.push(sprite);
  }
  return frames;
}

let cachedCharacters: CharacterDirectionSprites[] | null = null;

export function getCachedCharacterSprites(): CharacterDirectionSprites[] | null {
  return cachedCharacters;
}

export function loadCharacterSprites(assetsRoot: string): CharacterDirectionSprites[] | null {
  const charDir = path.join(assetsRoot, 'characters');
  const characters: CharacterDirectionSprites[] = [];

  for (let ci = 0; ci < CHAR_COUNT; ci++) {
    const filePath = path.join(charDir, `char_${ci}.png`);
    if (!fs.existsSync(filePath)) {
      console.log(`[CharacterLoader] char_${ci}.png not found, using built-in sprites`);
      return null;
    }

    try {
      const pngBuffer = fs.readFileSync(filePath);
      const png = PNG.sync.read(pngBuffer);

      const charData: CharacterDirectionSprites = { down: [], up: [], right: [] };
      DIRECTIONS.forEach((dir, dirIdx) => {
        charData[dir] = pngToFrames(png, dirIdx);
      });
      characters.push(charData);
    } catch (err) {
      console.error(`[CharacterLoader] Failed to load char_${ci}.png:`, err);
      return null;
    }
  }

  console.log(`[CharacterLoader] ✅ Loaded ${characters.length} character sprites`);
  cachedCharacters = characters;
  return characters;
}

// ── Wall tiles ──────────────────────────────────────────────────
// walls.png: 64×128, 4 cols × 4 rows, each piece 16×32
// Bitmask M: col = M % 4, row = floor(M / 4)
const WALL_PIECE_W = 16;
const WALL_PIECE_H = 32;
const WALL_GRID_COLS = 4;
const WALL_BITMASK_COUNT = 16;

let cachedWallSprites: SpriteData[] | null = null;

export function getCachedWallSprites(): SpriteData[] | null {
  return cachedWallSprites;
}

export function loadWallSprites(assetsRoot: string): SpriteData[] | null {
  const filePath = path.join(assetsRoot, 'walls.png');
  if (!fs.existsSync(filePath)) {
    console.log('[WallLoader] walls.png not found, using solid color fallback');
    return null;
  }

  try {
    const png = PNG.sync.read(fs.readFileSync(filePath));
    const sprites: SpriteData[] = [];

    for (let mask = 0; mask < WALL_BITMASK_COUNT; mask++) {
      const ox = (mask % WALL_GRID_COLS) * WALL_PIECE_W;
      const oy = Math.floor(mask / WALL_GRID_COLS) * WALL_PIECE_H;
      const sprite: SpriteData = [];

      for (let y = 0; y < WALL_PIECE_H; y++) {
        const row: string[] = [];
        for (let x = 0; x < WALL_PIECE_W; x++) {
          const idx = ((oy + y) * png.width + (ox + x)) * 4;
          const r = png.data[idx]!;
          const g = png.data[idx + 1]!;
          const b = png.data[idx + 2]!;
          const a = png.data[idx + 3]!;
          if (a < ALPHA_THRESHOLD) {
            row.push('');
          } else {
            row.push(`#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase());
          }
        }
        sprite.push(row);
      }
      sprites.push(sprite);
    }

    console.log(`[WallLoader] ✅ Loaded ${sprites.length} wall tile pieces`);
    cachedWallSprites = sprites;
    return sprites;
  } catch (err) {
    console.error('[WallLoader] Failed to load walls.png:', err);
    return null;
  }
}
