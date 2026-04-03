import { useEffect, useRef, useState } from 'react';

import { useTranslation } from '@repo/i18n';

import { ScrollReveal } from '../../../shared/ui/scroll-reveal';

const FRAME_W = 16;
const FRAME_H = 32;
const ZOOM = 3;
const SPRITE_W = FRAME_W * ZOOM;
const SPRITE_H = FRAME_H * ZOOM;

const ROW_DOWN = 0;
const ROW_RIGHT = 2;

const FRAME_WALK_A = 0;
const FRAME_WALK_B = 2;
const FRAME_SIT_IDLE = [3, 4] as const;
const FRAME_SIT_WORK = [5, 6] as const;

const TOOLS = ['Read', 'Bash', 'Edit', 'WebSearch', 'Glob', 'Write'];

const TILE = 16 * ZOOM;
const COLS = 18;
const FLOOR_ROWS = 9;
const WALL_ROWS = 2;
const FLOOR_OFFSET_Y = TILE * WALL_ROWS;
const CANVAS_H = TILE * (WALL_ROWS + FLOOR_ROWS);
const CANVAS_W = TILE * COLS;

// 캐릭터가 앉는 행
const DESK_ROW = 3;

// 걷기 구역
const WALK_ZONE_Y1 = FLOOR_OFFSET_Y + TILE * 6;
const WALK_ZONE_X_MAX = CANVAS_W - SPRITE_W;

const FLOOR_COLOR_A = '#1e2336';
const FLOOR_COLOR_B = '#1b2030';
const FLOOR_LOUNGE_A = '#222640';
const FLOOR_LOUNGE_B = '#1f2339';
const WALL_TOP_COLOR = '#1a1e32';
const WALL_MID_COLOR = '#222844';
const DESK_TOP_COLOR = '#7a5c28';
const DESK_FRONT_COLOR = '#5a4018';
const DESK_HIGHLIGHT = '#9a7838';
const PC_COLOR = '#253040';
const SCREEN_COLOR = '#0d1520';
const WINDOW_FRAME_COLOR = '#2e3860';
const SOFA_COLOR = '#2e3a5a';
const SOFA_CUSHION = '#3a4870';
const PLANT_POT_COLOR = '#7a3a12';
const PLANT_LEAF_COLOR = '#2a5e38';
const PLANT_LEAF2_COLOR = '#358048';

// 워크스테이션: 캐릭터 tileCol과 동일
const WORKSTATIONS = [
  { col: 3, row: DESK_ROW },
  { col: 8, row: DESK_ROW },
  { col: 13, row: DESK_ROW },
];

type AgentDef = {
  id: number;
  name: string;
  charIdx: number;
  tileCol: number;
  tileRow: number;
  state: 'idle' | 'working';
  tool: string | null;
};

type WalkAgent = {
  id: number;
  name: string;
  charIdx: number;
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number;
  walkTimer: number;
  walkFrame: 0 | 1;
};

const AGENTS_INIT: AgentDef[] = [
  {
    id: 0,
    name: 'a3f9c2d1',
    charIdx: 1,
    tileCol: 3,
    tileRow: DESK_ROW,
    state: 'working',
    tool: 'Read',
  },
  { id: 1, name: 'b7e1f034', charIdx: 3, tileCol: 8, tileRow: DESK_ROW, state: 'idle', tool: null },
  {
    id: 2,
    name: 'c5d8a219',
    charIdx: 5,
    tileCol: 13,
    tileRow: DESK_ROW,
    state: 'working',
    tool: 'Bash',
  },
];

const WALK_AGENTS_INIT: WalkAgent[] = [
  {
    id: 10,
    name: 'd2e4f601',
    charIdx: 0,
    x: TILE * 1.5,
    y: WALK_ZONE_Y1,
    dir: 1,
    speed: 30,
    walkTimer: 0,
    walkFrame: 0,
  },
];

function loadSprite(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawWall(ctx: CanvasRenderingContext2D) {
  for (let c = 0; c < COLS; c++) {
    ctx.fillStyle = WALL_TOP_COLOR;
    ctx.fillRect(c * TILE, 0, TILE, TILE);
    ctx.fillStyle = WALL_MID_COLOR;
    ctx.fillRect(c * TILE, TILE, TILE, TILE);
  }
  ctx.fillStyle = '#2e3560';
  ctx.fillRect(0, FLOOR_OFFSET_Y - 3, CANVAS_W, 3);
  drawWindow(ctx, 1);
  drawWindow(ctx, 5);
  drawWindow(ctx, 11);
  drawWindow(ctx, 15);
}

function drawWindow(ctx: CanvasRenderingContext2D, col: number) {
  const x = col * TILE + TILE * 0.08;
  const y = TILE * 0.08;
  const w = TILE * 1.84;
  const h = TILE * 1.84;
  ctx.fillStyle = WINDOW_FRAME_COLOR;
  ctx.fillRect(x, y, w, h);
  const grad = ctx.createLinearGradient(x + 3, y + 3, x + 3, y + h - 3);
  grad.addColorStop(0, 'rgba(120,170,255,0.12)');
  grad.addColorStop(1, 'rgba(40,80,160,0.06)');
  ctx.fillStyle = grad;
  ctx.fillRect(x + 3, y + 3, w - 6, h - 6);
  ctx.fillStyle = 'rgba(200,220,255,0.08)';
  ctx.fillRect(x + 4, y + 4, (w - 8) * 0.45, (h - 8) * 0.4);
  ctx.fillStyle = WINDOW_FRAME_COLOR;
  ctx.fillRect(x + w / 2 - 1.5, y + 3, 3, h - 6);
  ctx.fillRect(x + 3, y + h / 2 - 1.5, w - 6, 3);
}

function drawFloor(ctx: CanvasRenderingContext2D) {
  for (let r = 0; r < FLOOR_ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const isLounge = r >= 5;
      ctx.fillStyle =
        (c + r) % 2 === 0
          ? isLounge
            ? FLOOR_LOUNGE_A
            : FLOOR_COLOR_A
          : isLounge
            ? FLOOR_LOUNGE_B
            : FLOOR_COLOR_B;
      ctx.fillRect(c * TILE, FLOOR_OFFSET_Y + r * TILE, TILE, TILE);
      ctx.strokeStyle = '#161b2c';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(c * TILE, FLOOR_OFFSET_Y + r * TILE, TILE, TILE);
    }
  }
  ctx.fillStyle = 'rgba(60,45,100,0.2)';
  ctx.fillRect(TILE, FLOOR_OFFSET_Y + TILE * 6, TILE * (COLS - 2), TILE * 2.5);
  ctx.strokeStyle = '#2e3555';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(0, FLOOR_OFFSET_Y + TILE * 5);
  ctx.lineTo(CANVAS_W, FLOOR_OFFSET_Y + TILE * 5);
  ctx.stroke();
}

// 책상 레이아웃 기준값 (col, row 기준)
// 캐릭터 발 Y = FLOOR_OFFSET_Y + row * TILE
// 책상 윗면 Y = 캐릭터 발 Y - SPRITE_H * 0.5  (허리 높이)
// 모니터 Y = 책상 윗면 Y - 모니터 높이

function deskMetrics(col: number, row: number) {
  const cx = col * TILE + TILE / 2;
  const footY = FLOOR_OFFSET_Y + row * TILE; // 캐릭터 발(타일 하단)
  const charTopY = footY - SPRITE_H; // 캐릭터 머리 위
  const deskSurfaceY = footY - SPRITE_H * 0.52; // 책상 윗면: 캐릭터 허리
  const deskW = TILE * 1.8;
  const deskX = cx - deskW / 2;
  return { cx, footY, charTopY, deskSurfaceY, deskW, deskX };
}

// 1단계: 모니터 (캐릭터보다 뒤에 그림)
function drawMonitor(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const { cx, deskSurfaceY } = deskMetrics(col, row);
  const monW = TILE * 1.1;
  const monH = TILE * 0.68;
  const monX = cx - monW / 2;
  const monY = deskSurfaceY - monH - 2;

  // 스탠드
  ctx.fillStyle = '#141c28';
  ctx.fillRect(cx - 2, deskSurfaceY - 4, 4, 6);

  // 모니터 본체
  ctx.fillStyle = PC_COLOR;
  ctx.fillRect(monX, monY, monW, monH);
  ctx.strokeStyle = '#101520';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(monX, monY, monW, monH);

  // 화면
  const p = 4;
  ctx.fillStyle = SCREEN_COLOR;
  ctx.fillRect(monX + p, monY + p, monW - p * 2, monH - p * 2);

  // 코드 줄
  const sl = monX + p + 4;
  const sw = monW - p * 2 - 8;
  ctx.fillStyle = '#4488DD';
  ctx.globalAlpha = 0.7;
  ctx.fillRect(sl, monY + p + 4, sw * 0.5, 3);
  ctx.fillRect(sl, monY + p + 10, sw * 0.8, 3);
  ctx.fillRect(sl, monY + p + 16, sw * 0.6, 3);
  ctx.fillStyle = '#44CCAA';
  ctx.globalAlpha = 0.5;
  ctx.fillRect(sl, monY + p + 22, sw * 0.9, 3);
  ctx.fillStyle = '#CC88FF';
  ctx.globalAlpha = 0.4;
  ctx.fillRect(sl, monY + p + 28, sw * 0.4, 3);
  ctx.globalAlpha = 1;
}

// 3단계: 책상 윗면 + 앞면 (캐릭터보다 앞에 그림 — 하체 가림)
function drawDeskFront(ctx: CanvasRenderingContext2D, col: number, row: number) {
  const { deskSurfaceY, deskW, deskX } = deskMetrics(col, row);
  const surfaceH = TILE * 0.2;
  const frontH = TILE * 0.48;

  // 그림자
  ctx.fillStyle = 'rgba(0,0,0,0.25)';
  ctx.fillRect(deskX + 3, deskSurfaceY + surfaceH + 3, deskW, frontH * 0.6);

  // 책상 윗면
  ctx.fillStyle = DESK_TOP_COLOR;
  ctx.fillRect(deskX, deskSurfaceY, deskW, surfaceH);
  ctx.fillStyle = DESK_HIGHLIGHT;
  ctx.fillRect(deskX, deskSurfaceY, deskW, 2);

  // 앞면 판넬
  ctx.fillStyle = DESK_FRONT_COLOR;
  ctx.fillRect(deskX, deskSurfaceY + surfaceH, deskW, frontH);
  ctx.strokeStyle = '#3a2a0a';
  ctx.lineWidth = 1;
  ctx.strokeRect(deskX, deskSurfaceY + surfaceH, deskW, frontH);

  // 다리
  ctx.fillStyle = '#3a2808';
  ctx.fillRect(deskX + 5, deskSurfaceY + surfaceH + frontH, 6, 8);
  ctx.fillRect(deskX + deskW - 11, deskSurfaceY + surfaceH + frontH, 6, 8);
}

function drawPlant(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = PLANT_POT_COLOR;
  ctx.fillRect(x - 7, y - 9, 14, 9);
  ctx.fillStyle = '#5a2a0c';
  ctx.fillRect(x - 8, y - 11, 16, 3);
  ctx.fillStyle = '#1a1008';
  ctx.fillRect(x - 6, y - 9, 12, 3);
  ctx.fillStyle = '#1c3d24';
  ctx.fillRect(x - 1, y - 22, 2, 13);
  ctx.fillStyle = PLANT_LEAF_COLOR;
  ctx.beginPath();
  ctx.ellipse(x - 8, y - 24, 8, 4, -0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PLANT_LEAF2_COLOR;
  ctx.beginPath();
  ctx.ellipse(x + 7, y - 27, 8, 4, 0.4, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = PLANT_LEAF_COLOR;
  ctx.beginPath();
  ctx.ellipse(x, y - 30, 6, 4.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

function drawSofa(ctx: CanvasRenderingContext2D, x: number, y: number, w: number) {
  ctx.fillStyle = SOFA_COLOR;
  ctx.fillRect(x, y - TILE * 0.55, w, TILE * 0.55);
  ctx.fillStyle = SOFA_CUSHION;
  ctx.fillRect(x, y - TILE * 0.55, w, 3);
  ctx.fillStyle = SOFA_CUSHION;
  ctx.fillRect(x, y, w, TILE * 0.42);
  ctx.strokeStyle = SOFA_COLOR;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x + w / 3, y);
  ctx.lineTo(x + w / 3, y + TILE * 0.42);
  ctx.moveTo(x + (w * 2) / 3, y);
  ctx.lineTo(x + (w * 2) / 3, y + TILE * 0.42);
  ctx.stroke();
  ctx.fillStyle = '#1c2238';
  ctx.fillRect(x + 4, y + TILE * 0.42, 6, 7);
  ctx.fillRect(x + w - 10, y + TILE * 0.42, 6, 7);
}

function drawDecor(ctx: CanvasRenderingContext2D) {
  drawPlant(ctx, TILE * 0.55, FLOOR_OFFSET_Y + TILE * 1.1);
  drawPlant(ctx, TILE * (COLS - 0.55), FLOOR_OFFSET_Y + TILE * 1.1);
  drawSofa(ctx, TILE * 2, FLOOR_OFFSET_Y + TILE * 7, TILE * 4.5);
  drawSofa(ctx, TILE * 10.5, FLOOR_OFFSET_Y + TILE * 7, TILE * 5);
}

function drawSprite(
  ctx: CanvasRenderingContext2D,
  sheet: HTMLImageElement,
  frameIdx: number,
  row: number,
  destX: number,
  destY: number,
  flipX = false,
) {
  ctx.imageSmoothingEnabled = false;
  if (flipX) {
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(
      sheet,
      frameIdx * FRAME_W,
      row * FRAME_H,
      FRAME_W,
      FRAME_H,
      -(destX + SPRITE_W),
      destY,
      SPRITE_W,
      SPRITE_H,
    );
    ctx.restore();
  } else {
    ctx.drawImage(
      sheet,
      frameIdx * FRAME_W,
      row * FRAME_H,
      FRAME_W,
      FRAME_H,
      destX,
      destY,
      SPRITE_W,
      SPRITE_H,
    );
  }
}

function drawNameTag(
  ctx: CanvasRenderingContext2D,
  name: string,
  cx: number,
  topY: number,
  active: boolean,
) {
  const fontSize = 9;
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  const tw = ctx.measureText(name).width;
  const dotR = 3;
  const tagW = dotR * 2 + 4 + tw + 8;
  const tagH = fontSize + 6;
  const tx = cx - tagW / 2;
  const ty = topY - tagH - 4;
  ctx.fillStyle = 'rgba(0,0,0,0.72)';
  ctx.beginPath();
  ctx.roundRect(tx, ty, tagW, tagH, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(tx + dotR + 4, ty + tagH / 2, dotR, 0, Math.PI * 2);
  ctx.fillStyle = active ? '#4ADE80' : '#6B7280';
  ctx.fill();
  ctx.fillStyle = '#F0F0F0';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, tx + dotR * 2 + 6 + tw / 2, ty + tagH / 2);
}

function drawToolBubble(
  ctx: CanvasRenderingContext2D,
  tool: string,
  cx: number,
  nameTagTopY: number,
) {
  const fontSize = 8;
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = 'center';
  const tw = ctx.measureText(tool).width;
  const padX = 6,
    padY = 4;
  const bw = tw + padX * 2,
    bh = fontSize + padY * 2;
  const bx = cx - bw / 2,
    by = nameTagTopY - bh - 6;
  ctx.fillStyle = 'rgba(20,20,40,0.88)';
  ctx.beginPath();
  ctx.roundRect(bx, by, bw, bh, 3);
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(cx - 4, by + bh);
  ctx.lineTo(cx + 4, by + bh);
  ctx.lineTo(cx, by + bh + 5);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#A5F3FC';
  ctx.textBaseline = 'middle';
  ctx.fillText(tool, cx, by + bh / 2);
}

export function LivePreviewSection() {
  const { t } = useTranslation('web');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sheetsRef = useRef<HTMLImageElement[]>([]);
  const frameTimerRef = useRef(0);
  const frameIdxRef = useRef(0);
  const [agents, setAgents] = useState<AgentDef[]>(AGENTS_INIT);
  const agentsRef = useRef<AgentDef[]>(AGENTS_INIT);
  const walkAgentsRef = useRef<WalkAgent[]>(WALK_AGENTS_INIT.map((a) => ({ ...a })));
  const rafRef = useRef<number>(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    Promise.all([0, 1, 2, 3, 4, 5].map((i) => loadSprite(`/assets/characters/char_${i}.png`))).then(
      (imgs) => {
        sheetsRef.current = imgs;
      },
    );
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setAgents((prev) => {
        const next = prev.map((a) =>
          a.state === 'working'
            ? { ...a, tool: TOOLS[(TOOLS.indexOf(a.tool ?? 'Read') + 1) % TOOLS.length] ?? 'Read' }
            : a,
        );
        agentsRef.current = next;
        return next;
      });
    }, 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (!visible) return;
    let last = 0;

    const loop = (ts: number) => {
      const dt = Math.min((ts - last) / 1000, 0.05);
      last = ts;

      frameTimerRef.current += dt;
      if (frameTimerRef.current >= 0.4) {
        frameTimerRef.current = 0;
        frameIdxRef.current = frameIdxRef.current === 0 ? 1 : 0;
      }

      for (const wa of walkAgentsRef.current) {
        wa.x += wa.speed * wa.dir * dt;
        wa.walkTimer += dt;
        if (wa.walkTimer >= 0.25) {
          wa.walkTimer = 0;
          wa.walkFrame = wa.walkFrame === 0 ? 1 : 0;
        }
        if (wa.x < 0) {
          wa.x = 0;
          wa.dir = 1;
        }
        if (wa.x > WALK_ZONE_X_MAX) {
          wa.x = WALK_ZONE_X_MAX;
          wa.dir = -1;
        }
      }

      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.imageSmoothingEnabled = false;

      drawWall(ctx);
      drawFloor(ctx);
      drawDecor(ctx);

      // 1) 모니터 (캐릭터 뒤)
      for (const ws of WORKSTATIONS) {
        drawMonitor(ctx, ws.col, ws.row);
      }

      const fi = frameIdxRef.current;

      // 2) 앉아있는 캐릭터
      for (const agent of agentsRef.current) {
        const sheet = sheetsRef.current[agent.charIdx];
        if (!sheet) continue;

        const isWorking = agent.state === 'working';
        const sitFrames = isWorking ? FRAME_SIT_WORK : FRAME_SIT_IDLE;
        const frameIdx = sitFrames[fi % 2] ?? sitFrames[0];

        const { cx, footY } = deskMetrics(agent.tileCol, agent.tileRow);
        const destX = cx - SPRITE_W / 2;
        const destY = footY - SPRITE_H;

        drawSprite(ctx, sheet, frameIdx, ROW_DOWN, destX, destY);
        drawNameTag(ctx, agent.name, cx, destY, isWorking);
        if (agent.tool && isWorking) drawToolBubble(ctx, agent.tool, cx, destY);
      }

      // 3) 책상 앞면 (하체 가리기)
      for (const ws of WORKSTATIONS) {
        drawDeskFront(ctx, ws.col, ws.row);
      }

      // 4) 걸어다니는 캐릭터 (라운지, 최상단)
      for (const wa of walkAgentsRef.current) {
        const sheet = sheetsRef.current[wa.charIdx];
        if (!sheet) continue;
        const frameIdx = wa.walkFrame === 0 ? FRAME_WALK_A : FRAME_WALK_B;
        const cx = wa.x + SPRITE_W / 2;
        drawSprite(ctx, sheet, frameIdx, ROW_RIGHT, wa.x, wa.y, wa.dir === -1);
        drawNameTag(ctx, wa.name, cx, wa.y, false);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible]);

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="text-center mb-16">
          <p className="text-claude-orange-light text-sm font-medium uppercase tracking-wider mb-3">
            {t('livePreview.eyebrow')}
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {t('livePreview.title')}
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto break-keep">
            {t('livePreview.description')}
          </p>
          <p className="mt-4 text-xs text-muted-foreground/60">
            {t('livePreview.builtWith')}{' '}
            <a
              href="https://github.com/pablodelucca/pixel-agents"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground/80 underline underline-offset-2 hover:text-claude-orange-light transition-colors"
            >
              pixel-agents
            </a>
          </p>
        </ScrollReveal>

        <ScrollReveal>
          <div className="relative rounded-2xl border border-border/50 bg-card overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between gap-2 px-5 py-3 border-b border-border/50 bg-card/80">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  {t('livePreview.windowTitle')}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {t('livePreview.workingCount', {
                  count: agents.filter((a) => a.state === 'working').length,
                })}
              </div>
            </div>

            <div className="bg-[#161b2a] flex justify-center py-2">
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                style={{
                  imageRendering: 'pixelated',
                  width: '100%',
                  maxWidth: CANVAS_W,
                  display: 'block',
                }}
              />
            </div>

            <div className="px-5 py-3 border-t border-border/30 bg-card/60 flex flex-wrap gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-2 text-xs text-muted-foreground"
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${agent.state === 'working' ? 'bg-emerald-400 animate-pulse' : 'bg-gray-500'}`}
                  />
                  <span className="font-mono">{agent.name}</span>
                  {agent.tool ? (
                    <span className="text-cyan-400 font-mono">{agent.tool}</span>
                  ) : (
                    <span className="text-gray-500">{t('livePreview.idle')}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: t('livePreview.cards.fileChanges.label'),
              desc: t('livePreview.cards.fileChanges.description'),
            },
            {
              label: t('livePreview.cards.multiAgent.label'),
              desc: t('livePreview.cards.multiAgent.description'),
            },
            {
              label: t('livePreview.cards.subagents.label'),
              desc: t('livePreview.cards.subagents.description'),
            },
          ].map((item, i) => (
            <ScrollReveal key={item.label} delay={i * 80}>
              <div className="rounded-xl border border-border/40 bg-card/30 px-4 py-3">
                <p className="text-xs font-semibold text-claude-orange-light mb-1">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
