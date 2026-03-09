import { clearColorizeCache, getColorizedSprite } from './colorize';
import { FALLBACK_FLOOR_COLOR, TILE_SIZE } from './constants';
import type { FloorColor, SpriteData } from './types';

/** Default solid gray 16×16 tile */
const DEFAULT_FLOOR_SPRITE: SpriteData = Array.from(
  { length: TILE_SIZE },
  () => Array(TILE_SIZE).fill(FALLBACK_FLOOR_COLOR) as string[],
);

export const WALL_COLOR = '#3A3A5C';

let floorSprites: SpriteData[] = [];

export function setFloorSprites(sprites: SpriteData[]): void {
  floorSprites = sprites;
  clearColorizeCache();
}

export function getFloorSprite(patternIndex: number): SpriteData | null {
  const idx = patternIndex - 1;
  if (idx < 0) return null;
  if (idx < floorSprites.length) return floorSprites[idx] ?? null;
  if (floorSprites.length === 0 && patternIndex >= 1) return DEFAULT_FLOOR_SPRITE;
  return null;
}

export function hasFloorSprites(): boolean {
  return true;
}

export function getFloorPatternCount(): number {
  return floorSprites.length > 0 ? floorSprites.length : 1;
}

export function getColorizedFloorSprite(patternIndex: number, color: FloorColor): SpriteData {
  const sprite = getFloorSprite(patternIndex) ?? DEFAULT_FLOOR_SPRITE;
  const { h, s, b, c } = color;
  const key = `floor-${patternIndex}-${h}-${s}-${b}-${c}-${color.colorize ? 1 : 0}`;
  return getColorizedSprite(key, sprite, { ...color, colorize: true });
}
