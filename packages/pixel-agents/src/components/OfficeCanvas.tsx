import { useEffect, useRef } from 'react';

import { startGameLoop } from '../engine/game-loop';
import { renderOffice } from '../engine/renderer';
import type { OfficeState } from '../engine/office-state';
import { TILE_SIZE } from '../types';

export interface OfficeCanvasProps {
  officeState: OfficeState;
  zoom?: number;
  onZoomChange?: (zoom: number) => void;
  className?: string;
}

function fitZoom(canvasW: number, canvasH: number, cols: number, rows: number): number {
  const zx = Math.floor(canvasW / (cols * TILE_SIZE));
  const zy = Math.floor(canvasH / (rows * TILE_SIZE));
  return Math.max(1, Math.min(zx, zy));
}

export function OfficeCanvas({ officeState, zoom: zoomProp, onZoomChange, className }: OfficeCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const zoomRef = useRef(zoomProp ?? 2);

  // Sync zoom prop
  useEffect(() => {
    if (zoomProp !== undefined) {
      zoomRef.current = zoomProp;
    }
  }, [zoomProp]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        // 크기 변경 시 fit zoom 재계산
        const layout = officeState.layout;
        const fz = fitZoom(canvas.width, canvas.height, layout.cols, layout.rows);
        zoomRef.current = fz;
        onZoomChange?.(fz);
      }
    });
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
      // 초기 fit zoom
      const layout = officeState.layout;
      const fz = fitZoom(canvas.width, canvas.height, layout.cols, layout.rows);
      zoomRef.current = fz;
      onZoomChange?.(fz);
    }

    const stop = startGameLoop(canvas, {
      update: (dt) => {
        officeState.update(dt);
      },
      render: (ctx) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const zoom = zoomRef.current;
        const layout = officeState.layout;
        const mapW = layout.cols * 16 * zoom;
        const mapH = layout.rows * 16 * zoom;
        const offsetX = Math.floor((canvas.width - mapW) / 2);
        const offsetY = Math.floor((canvas.height - mapH) / 2);

        renderOffice(ctx, {
          tileMap: officeState.tileMap,
          furniture: officeState.furniture,
          characters: officeState.getCharacters(),
          tileColors: layout.tileColors ?? undefined,
          cols: layout.cols,
          rows: layout.rows,
        }, offsetX, offsetY, zoom);
      },
    });

    return () => {
      stop();
      resizeObserver.disconnect();
    };
  }, [officeState]);


  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
    />
  );
}
