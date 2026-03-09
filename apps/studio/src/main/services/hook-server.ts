import * as fs from 'fs';
import * as net from 'net';
import * as os from 'os';
import * as path from 'path';

import type { HookEvent } from './live-types';

const SOCKET_PATH = path.join(os.homedir(), '.claude', 'studio.sock');

let server: net.Server | null = null;

export function startHookServer(onEvent: (event: HookEvent) => void): void {
  if (server) return;

  // stale 소켓 파일 제거
  try {
    fs.unlinkSync(SOCKET_PATH);
  } catch {
    // 존재하지 않으면 무시
  }

  server = net.createServer((conn) => {
    let buf = '';
    conn.on('data', (chunk) => {
      buf += chunk.toString('utf8');
    });
    conn.on('end', () => {
      const text = buf.trim();
      if (!text) return;
      try {
        const event = JSON.parse(text) as HookEvent;
        onEvent(event);
      } catch {
        // 파싱 실패 무시
      }
    });
    conn.on('error', () => {
      // 연결 오류 무시
    });
  });

  server.on('error', () => {
    server = null;
  });

  server.listen(SOCKET_PATH, () => {
    // 소켓 파일 권한을 사용자만 접근 가능하게
    try {
      fs.chmodSync(SOCKET_PATH, 0o600);
    } catch {
      // ignore
    }
  });
}

export function stopHookServer(): void {
  if (!server) return;
  server.close();
  server = null;
  try {
    fs.unlinkSync(SOCKET_PATH);
  } catch {
    // ignore
  }
}
