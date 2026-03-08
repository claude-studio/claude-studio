// Types (const enums and interfaces)
export {
  CharacterState,
  DEFAULT_COLS,
  DEFAULT_ROWS,
  Direction,
  FurnitureType,
  MATRIX_EFFECT_DURATION,
  MAX_COLS,
  MAX_ROWS,
  TILE_SIZE,
  TileType,
} from './types';
export type {
  Character,
  FloorColor,
  FurnitureCatalogEntry,
  FurnitureInstance,
  OfficeLayout,
  PlacedFurniture,
  Seat,
  SpriteData,
  ToolActivity,
} from './types';

// Messages
export type {
  AgentClosedEvent,
  AgentCreatedEvent,
  AgentIdleEvent,
  AgentSessionEndEvent,
  AgentWorkingEvent,
  AgentToolDoneEvent,
  AgentToolPermissionEvent,
  AgentToolsClearEvent,
  AgentToolStartEvent,
  PixelAgentEvent,
  PixelAgentEventType,
} from './messages';

// Engine
export { OfficeState } from './engine/office-state';
export { startGameLoop } from './engine/game-loop';
export { renderOffice } from './engine/renderer';
export type { RenderState } from './engine/renderer';

// Sprites
export { getCachedSprite, getOutlineSprite } from './sprites/sprite-cache';
export { getCharacterSprites, setCharacterTemplates } from './sprites/sprite-data';
export type { CharacterSprites } from './sprites/sprite-data';

// Layout
export { findPath, getWalkableTiles, isWalkable } from './layout/tile-map';
export {
  createDefaultLayout,
  layoutToFurnitureInstances,
  layoutToSeats,
  layoutToTileMap,
} from './layout/layout-serializer';

// Hooks
export { processPixelAgentEvent } from './hooks/use-pixel-messages';

// Components
export { OfficeCanvas } from './components/OfficeCanvas';
export type { OfficeCanvasProps } from './components/OfficeCanvas';

// Utils
export { defaultZoom, extractToolName } from './tool-utils';

// Floor/Wall tiles
export { getColorizedFloorSprite, hasFloorSprites, setFloorSprites, WALL_COLOR } from './floor-tiles';
export { hasWallSprites, setWallSprites } from './wall-tiles';

// Colorize
export { adjustSprite, clearColorizeCache, colorizeSprite, getColorizedSprite } from './colorize';
