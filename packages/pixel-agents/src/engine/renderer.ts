import {
  BUBBLE_FADE_DURATION_SEC,
  BUBBLE_SITTING_OFFSET_PX,
  BUBBLE_VERTICAL_OFFSET_PX,
  CHARACTER_SITTING_OFFSET_PX,
  CHARACTER_Z_SORT_OFFSET,
  GRID_LINE_COLOR,
  TILE_SIZE,
} from '../constants';
import { getColorizedFloorSprite, WALL_COLOR } from '../floor-tiles';
import type {
  Character,
  FloorColor,
  FurnitureInstance,
  SpriteData,
  TileType as TileTypeVal,
} from '../types';
import { CharacterState, TileType } from '../types';

import { getCachedSprite } from '../sprites/sprite-cache';
import {
  BUBBLE_PERMISSION_SPRITE,
  BUBBLE_WAITING_SPRITE,
  getCharacterSprites,
} from '../sprites/sprite-data';
import { getCharacterSprite } from './characters';

export function renderTileGrid(
  ctx: CanvasRenderingContext2D,
  tileMap: TileTypeVal[][],
  offsetX: number,
  offsetY: number,
  zoom: number,
  tileColors?: Array<FloorColor | null>,
): void {
  const s = TILE_SIZE * zoom;
  const tmRows = tileMap.length;
  const tmCols = tmRows > 0 ? tileMap[0]!.length : 0;

  for (let r = 0; r < tmRows; r++) {
    for (let c = 0; c < tmCols; c++) {
      const tile = tileMap[r]![c]!;
      if (tile === TileType.VOID) continue;

      if (tile === TileType.WALL) {
        ctx.fillStyle = WALL_COLOR;
        ctx.fillRect(offsetX + c * s, offsetY + r * s, s, s);
        continue;
      }

      const colorIdx = r * tmCols + c;
      const color = tileColors?.[colorIdx] ?? null;
      const sprite = getColorizedFloorSprite(tile, color ?? { h: 0, s: 0, b: 0, c: 0 });
      const cached = getCachedSprite(sprite, zoom);
      ctx.drawImage(cached, offsetX + c * s, offsetY + r * s);
    }
  }
}

export function renderGridLines(
  ctx: CanvasRenderingContext2D,
  cols: number,
  rows: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const s = TILE_SIZE * zoom;
  ctx.strokeStyle = GRID_LINE_COLOR;
  ctx.lineWidth = 1;
  ctx.beginPath();
  for (let c = 0; c <= cols; c++) {
    ctx.moveTo(offsetX + c * s, offsetY);
    ctx.lineTo(offsetX + c * s, offsetY + rows * s);
  }
  for (let r = 0; r <= rows; r++) {
    ctx.moveTo(offsetX, offsetY + r * s);
    ctx.lineTo(offsetX + cols * s, offsetY + r * s);
  }
  ctx.stroke();
}

export function renderFurniture(
  ctx: CanvasRenderingContext2D,
  furniture: FurnitureInstance[],
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  for (const item of furniture) {
    const cached = getCachedSprite(item.sprite, zoom);
    ctx.drawImage(cached, offsetX + item.x * zoom, offsetY + item.y * zoom);
  }
}

function renderSprite(
  ctx: CanvasRenderingContext2D,
  sprite: SpriteData,
  x: number,
  y: number,
  zoom: number,
  alpha = 1,
): void {
  const cached = getCachedSprite(sprite, zoom);
  if (alpha < 1) {
    ctx.globalAlpha = alpha;
  }
  ctx.drawImage(cached, x, y);
  if (alpha < 1) {
    ctx.globalAlpha = 1;
  }
}

function renderBubble(
  ctx: CanvasRenderingContext2D,
  ch: Character,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  if (!ch.bubbleType) return;

  const sittingOffset = ch.state === CharacterState.TYPE ? CHARACTER_SITTING_OFFSET_PX : 0;
  const anchorY = ch.y + sittingOffset;
  const bx = offsetX + ch.x * zoom;
  const by = offsetY + (anchorY - BUBBLE_VERTICAL_OFFSET_PX - BUBBLE_SITTING_OFFSET_PX) * zoom;

  let alpha = 1;
  if (ch.bubbleType === 'waiting') {
    alpha = Math.min(1, ch.bubbleTimer / BUBBLE_FADE_DURATION_SEC);
  }

  const sprite = ch.bubbleType === 'permission' ? BUBBLE_PERMISSION_SPRITE : BUBBLE_WAITING_SPRITE;
  const spriteW = (sprite[0]?.length ?? 0) * zoom;
  renderSprite(ctx, sprite, bx - spriteW / 2, by, zoom, alpha);
}

export function renderCharacters(
  ctx: CanvasRenderingContext2D,
  characters: Character[],
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  const sorted = [...characters].sort((a, b) => {
    const ay = a.y + CHARACTER_Z_SORT_OFFSET;
    const by2 = b.y + CHARACTER_Z_SORT_OFFSET;
    return ay - by2;
  });

  for (const ch of sorted) {
    if (ch.matrixEffect) {
      renderMatrixEffect(ctx, ch, offsetX, offsetY, zoom);
      continue;
    }

    const sprites = getCharacterSprites(ch.palette, ch.hueShift);
    const sprite = getCharacterSprite(ch, sprites);

    const sittingOffset = ch.state === CharacterState.TYPE ? CHARACTER_SITTING_OFFSET_PX : 0;
    const spriteH = sprite.length * zoom;
    const spriteW = (sprite[0]?.length ?? 0) * zoom;
    const cx = offsetX + ch.x * zoom - spriteW / 2;
    const cy = offsetY + (ch.y + sittingOffset) * zoom - spriteH;

    renderSprite(ctx, sprite, cx, cy, zoom);
    renderBubble(ctx, ch, offsetX, offsetY, zoom);
    renderNameTag(ctx, ch, cx, cy, spriteW, zoom);
  }
}

function renderNameTag(
  ctx: CanvasRenderingContext2D,
  ch: Character,
  spriteCx: number,
  spriteCy: number,
  spriteW: number,
  zoom: number,
): void {
  const name = ch.folderName ?? `#${ch.id}`;

  const centerX = spriteCx + spriteW / 2;
  const dotR = Math.max(2, zoom);
  const fontSize = Math.max(9, zoom * 2.5);

  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const textW = ctx.measureText(name).width;
  const tagW = dotR * 2 + 4 + textW + 6;
  const tagH = fontSize + 4;
  const tagX = centerX - tagW / 2;
  const tagY = spriteCy - tagH - dotR - 2;

  // 배경
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.beginPath();
  ctx.roundRect(tagX, tagY, tagW, tagH, 3);
  ctx.fill();

  // dot
  const dotX = tagX + dotR + 4;
  const dotCY = tagY + tagH / 2;
  ctx.beginPath();
  ctx.arc(dotX, dotCY, dotR, 0, Math.PI * 2);
  ctx.fillStyle = '#4ADE80';
  ctx.fill();

  // 이름
  ctx.fillStyle = '#F0F0F0';
  ctx.fillText(name, dotX + dotR + 3 + textW / 2, tagY + tagH - (tagH - fontSize) / 2 - 1);

  // 도구 말풍선 (currentTool이 있을 때만)
  if (ch.currentTool) {
    renderToolBubble(ctx, ch.currentTool, centerX, tagY, zoom);
  }
}

function renderToolBubble(
  ctx: CanvasRenderingContext2D,
  tool: string,
  centerX: number,
  nameTagY: number,
  zoom: number,
): void {
  const fontSize = Math.max(7, zoom * 2);
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';

  const textW = ctx.measureText(tool).width;
  const padX = 5;
  const padY = 3;
  const bw = textW + padX * 2;
  const bh = fontSize + padY * 2;
  const bx = centerX - bw / 2;
  const by = nameTagY - bh - 4;
  const tailH = 4;

  // 배경
  ctx.fillStyle = 'rgba(20, 20, 40, 0.85)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 3);
  ctx.fill();

  // 테일 (▼)
  ctx.beginPath();
  ctx.moveTo(centerX - tailH, by + bh);
  ctx.lineTo(centerX + tailH, by + bh);
  ctx.lineTo(centerX, by + bh + tailH);
  ctx.closePath();
  ctx.fill();

  // 텍스트
  ctx.fillStyle = '#A5F3FC';
  ctx.fillText(tool, centerX, by + bh - padY);
}

function renderMatrixEffect(
  ctx: CanvasRenderingContext2D,
  ch: Character,
  offsetX: number,
  offsetY: number,
  zoom: number,
): void {
  // Simple matrix rain effect placeholder
  const progress = ch.matrixEffectTimer / 0.3;
  const alpha = ch.matrixEffect === 'spawn' ? progress : 1 - progress;

  ctx.globalAlpha = Math.max(0, Math.min(1, alpha)) * 0.7;
  ctx.fillStyle = '#00FF41';

  const x = offsetX + ch.x * zoom;
  const y = offsetY + ch.y * zoom;
  const size = TILE_SIZE * zoom;

  for (let i = 0; i < 4; i++) {
    const seed = ch.matrixEffectSeeds[i] ?? 0.5;
    ctx.fillRect(x - size / 2 + seed * size, y - size + i * (size / 4), zoom, size / 4);
  }

  ctx.globalAlpha = 1;
}

export interface RenderState {
  tileMap: TileTypeVal[][];
  furniture: FurnitureInstance[];
  characters: Character[];
  tileColors?: Array<FloorColor | null>;
  cols: number;
  rows: number;
}

export function renderOffice(
  ctx: CanvasRenderingContext2D,
  state: RenderState,
  offsetX: number,
  offsetY: number,
  zoom: number,
  showGrid = false,
): void {
  renderTileGrid(ctx, state.tileMap, offsetX, offsetY, zoom, state.tileColors);
  if (showGrid) {
    renderGridLines(ctx, state.cols, state.rows, offsetX, offsetY, zoom);
  }
  renderFurniture(ctx, state.furniture, offsetX, offsetY, zoom);
  renderCharacters(ctx, state.characters, offsetX, offsetY, zoom);
}
