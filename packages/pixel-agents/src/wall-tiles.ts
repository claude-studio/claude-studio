import type { SpriteData, TileType as TileTypeVal } from './types';
import { TileType } from './types';

let wallSprites: SpriteData[] | null = null;

export function setWallSprites(sprites: SpriteData[]): void {
  wallSprites = sprites;
}

export function hasWallSprites(): boolean {
  return wallSprites !== null;
}

export function wallColorToHex(_color: { h: number; s: number; b: number; c: number }): string {
  // Simple fallback: slightly shift the default wall color based on hue
  return '#3A3A5C';
}

export function getWallInstances(
  tileMap: TileTypeVal[][],
  zoom: number,
  offsetX: number,
  offsetY: number,
): Array<{ sprite: SpriteData; x: number; y: number }> {
  if (!wallSprites) return [];

  const tileSize = 16;
  const result: Array<{ sprite: SpriteData; x: number; y: number }> = [];
  const rows = tileMap.length;
  const cols = rows > 0 ? tileMap[0]!.length : 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (tileMap[r]![c] !== TileType.WALL) continue;

      // Build 4-bit bitmask: N=1, E=2, S=4, W=8
      let mask = 0;
      if (r > 0 && tileMap[r - 1]![c] === TileType.WALL) mask |= 1;
      if (c < cols - 1 && tileMap[r]![c + 1] === TileType.WALL) mask |= 2;
      if (r < rows - 1 && tileMap[r + 1]![c] === TileType.WALL) mask |= 4;
      if (c > 0 && tileMap[r]![c - 1] === TileType.WALL) mask |= 8;

      const sprite = wallSprites[mask % wallSprites.length];
      if (sprite) {
        result.push({
          sprite,
          x: offsetX + c * tileSize * zoom,
          y: offsetY + r * tileSize * zoom,
        });
      }
    }
  }

  return result;
}
