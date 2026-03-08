// Grid & Tile
export const TILE_SIZE = 16;
export const DEFAULT_COLS = 20;
export const DEFAULT_ROWS = 11;
export const MAX_COLS = 64;
export const MAX_ROWS = 64;

// Character Animation
export const WALK_SPEED_PX_PER_SEC = 48;
export const WALK_FRAME_DURATION_SEC = 0.12;
export const TYPE_FRAME_DURATION_SEC = 0.5;
export const WANDER_PAUSE_MIN_SEC = 2;
export const WANDER_PAUSE_MAX_SEC = 20;
export const WANDER_MOVES_BEFORE_REST_MIN = 2;
export const WANDER_MOVES_BEFORE_REST_MAX = 5;
export const SEAT_REST_MIN_SEC = 120;
export const SEAT_REST_MAX_SEC = 240;
export const INACTIVE_SEAT_TIMER_MIN_SEC = 2;
export const INACTIVE_SEAT_TIMER_RANGE_SEC = 4;

// Matrix effect
export const MATRIX_EFFECT_DURATION_SEC = 0.3;
export const MATRIX_TRAIL_LENGTH = 6;
export const MATRIX_SPRITE_COLS = 16;
export const MATRIX_SPRITE_ROWS = 24;
export const MATRIX_COLOR = '#ccffcc';

// Rendering
export const CHARACTER_SITTING_OFFSET_PX = 4;
export const CHARACTER_Z_SORT_OFFSET = 8;
export const CHARACTER_HIT_HALF_WIDTH = 6;
export const CHARACTER_HIT_HEIGHT = 20;
export const OUTLINE_Z_SORT_OFFSET = 0.1;
export const HOVERED_OUTLINE_ALPHA = 0.6;
export const SELECTED_OUTLINE_ALPHA = 1.0;
export const FALLBACK_FLOOR_COLOR = '#808080';

// Bubble
export const WAITING_BUBBLE_DURATION_SEC = 2;
export const BUBBLE_FADE_DURATION_SEC = 0.3;
export const DISMISS_BUBBLE_FAST_FADE_SEC = 0.3;
export const BUBBLE_VERTICAL_OFFSET_PX = 24;
export const BUBBLE_SITTING_OFFSET_PX = 4;

// Camera
export const CAMERA_LERP = 0.1;
export const CAMERA_SNAP_THRESHOLD = 0.5;

// Zoom
export const ZOOM_MIN = 1;
export const ZOOM_MAX = 10;
export const ZOOM_DEFAULT_DPR_FACTOR = 2;

// Game logic
export const MAX_DELTA_TIME_SEC = 0.1;

// Palette
export const PALETTE_COUNT = 6;
export const HUE_SHIFT_MIN_DEG = 45;
export const HUE_SHIFT_RANGE_DEG = 316 - 45;

// Seat colors
export const SEAT_OWN_COLOR = 'rgba(100,200,255,0.35)';
export const SEAT_AVAILABLE_COLOR = 'rgba(100,255,100,0.25)';
export const SEAT_BUSY_COLOR = 'rgba(255,100,100,0.25)';

// Grid line
export const GRID_LINE_COLOR = 'rgba(255,255,255,0.05)';

// Auto-on depth for desk detection
export const AUTO_ON_FACING_DEPTH = 3;
export const AUTO_ON_SIDE_DEPTH = 1;
