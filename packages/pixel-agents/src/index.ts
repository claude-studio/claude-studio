// Types (const enums and interfaces)
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

// Messages
export type {
  AgentClosedEvent,
  AgentCreatedEvent,
  AgentIdleEvent,
  AgentSessionEndEvent,
  AgentToolDoneEvent,
  AgentToolPermissionEvent,
  AgentToolsClearEvent,
  AgentToolStartEvent,
  AgentWorkingEvent,
  PixelAgentEvent,
  PixelAgentEventType,
} from './messages';

// Engine
export { startGameLoop } from './engine/game-loop';
export { OfficeState } from './engine/office-state';
export type { RenderState } from './engine/renderer';
export { renderOffice } from './engine/renderer';

// Sprites
export { getCachedSprite, getOutlineSprite } from './sprites/sprite-cache';
export type { CharacterSprites } from './sprites/sprite-data';
export { getCharacterSprites, setCharacterTemplates } from './sprites/sprite-data';

// Layout
export {
  createDefaultLayout,
  layoutToFurnitureInstances,
  layoutToSeats,
  layoutToTileMap,
} from './layout/layout-serializer';
export { findPath, getWalkableTiles, isWalkable } from './layout/tile-map';

// Hooks
export { processPixelAgentEvent } from './hooks/use-pixel-messages';

// Components
export type { OfficeCanvasProps } from './components/OfficeCanvas';
export { OfficeCanvas } from './components/OfficeCanvas';

// Utils
export { defaultZoom, extractToolName } from './tool-utils';

// Floor/Wall tiles
export {
  getColorizedFloorSprite,
  hasFloorSprites,
  setFloorSprites,
  WALL_COLOR,
} from './floor-tiles';
export { hasWallSprites, setWallSprites } from './wall-tiles';

// Colorize
export { adjustSprite, clearColorizeCache, colorizeSprite, getColorizedSprite } from './colorize';
