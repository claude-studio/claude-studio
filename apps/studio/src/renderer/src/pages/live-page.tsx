import { useEffect, useRef, useState } from 'react';

import type { PixelAgentEvent } from '@repo/pixel-agents';
import {
  OfficeCanvas,
  OfficeState,
  processPixelAgentEvent,
  setCharacterTemplates,
  setWallSprites,
} from '@repo/pixel-agents';

interface ActiveAgent {
  id: number;
  projectName: string;
}

export function LivePage() {
  console.log('[LivePage] render');
  const officeStateRef = useRef<OfficeState | null>(null);
  const [activeAgents, setActiveAgents] = useState<ActiveAgent[]>([]);
  const [zoom, setZoom] = useState(2);

  if (!officeStateRef.current) {
    officeStateRef.current = new OfficeState();
  }

  useEffect(() => {
    console.log('[LivePage] useEffect start, electronAPI:', !!window.electronAPI);
    const api = window.electronAPI;

    // 1. 이벤트 구독을 먼저 등록 (agentToolStart 놓치지 않도록)
    const unsubscribe = api.onLiveAgentEvent((event: PixelAgentEvent) => {
      console.log('[LivePage] onLiveAgentEvent:', event);
      const state = officeStateRef.current!;
      processPixelAgentEvent(state, event);

      setActiveAgents((prev) => {
        if (event.type === 'agentCreated') {
          if (prev.some((a) => a.id === event.id)) return prev;
          return [...prev, { id: event.id, projectName: event.projectName ?? '' }];
        }
        if (event.type === 'agentClosed') {
          return prev.filter((a) => a.id !== event.id);
        }
        return prev;
      });
    });

    // 2. 구독 등록 후 스프라이트 + 에이전트 로드
    api.getCharacterSprites().then((characters) => {
      if (characters) {
        setCharacterTemplates(
          characters as Array<{ down: string[][][]; up: string[][][]; right: string[][][] }>,
        );
      }
    });

    api.getWallSprites().then((walls) => {
      if (walls) {
        setWallSprites(walls as string[][][]);
      }
    });

    api.getActiveAgents().then((agents) => {
      console.log('[LivePage] getActiveAgents:', agents);
      setActiveAgents(agents.map((a) => ({ id: a.id, projectName: a.projectName })));
      for (const agent of agents) {
        officeStateRef.current!.addAgent(agent.id, {
          skipSpawnEffect: true,
          folderName: agent.shortId,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const officeState = officeStateRef.current;

  return (
    <div className="flex flex-col h-full bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">라이브 에이전트</span>
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-primary/15 text-primary uppercase tracking-wide">
            Beta
          </span>
          {activeAgents.length > 0 && (
            <span className="flex items-center gap-1 text-xs text-emerald-500">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              {activeAgents.length}명 활성
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoom((z) => Math.max(1, z - 1))}
            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:border-primary/30 hover:text-primary text-muted-foreground text-sm leading-none transition-colors"
          >
            −
          </button>
          <span className="text-xs text-muted-foreground font-mono w-8 text-center">{zoom}x</span>
          <button
            onClick={() => setZoom((z) => Math.min(10, z + 1))}
            className="w-6 h-6 flex items-center justify-center rounded border border-border hover:border-primary/30 hover:text-primary text-muted-foreground text-sm leading-none transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Canvas area */}
      <div className="flex-1 relative overflow-hidden min-h-0">
        <OfficeCanvas officeState={officeState} zoom={zoom} onZoomChange={setZoom} />
      </div>
    </div>
  );
}
