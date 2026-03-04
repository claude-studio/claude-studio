import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    {
      name: 'claude-api',
      configureServer(server) {
        server.middlewares.use('/api', async (req, res, next) => {
          const url = new URL(req.url || '/', 'http://localhost');
          const pathname = url.pathname;

          try {
            const shared = await import('../../packages/shared/src/index.ts');

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-cache');

            if (req.method === 'GET') {
              if (pathname === '/' || pathname === '') {
                const stats = shared.getDashboardStats();
                res.end(JSON.stringify(stats, replaceDates));
              } else if (pathname === '/projects') {
                const projects = shared.getProjects();
                res.end(JSON.stringify(projects, replaceDates));
              } else if (
                pathname.startsWith('/projects/') &&
                pathname.includes('/sessions')
              ) {
                const projectId = decodeURIComponent(
                  pathname.replace('/projects/', '').replace('/sessions', ''),
                );
                const sessions = shared.getProjectSessions(projectId);
                res.end(JSON.stringify(sessions, replaceDates));
              } else if (pathname === '/sessions') {
                const limit = url.searchParams.get('limit');
                const sessions = shared.getSessions();
                res.end(
                  JSON.stringify(
                    limit ? sessions.slice(0, parseInt(limit)) : sessions,
                    replaceDates,
                  ),
                );
              } else if (pathname.startsWith('/sessions/')) {
                const sessionId = pathname.replace('/sessions/', '');
                const detail = shared.getSessionDetail(sessionId);
                if (!detail) {
                  res.statusCode = 404;
                  res.end(JSON.stringify({ error: 'Not found' }));
                  return;
                }
                res.end(JSON.stringify(detail, replaceDates));
              } else if (pathname === '/search') {
                const q = url.searchParams.get('q') || '';
                const results = shared.searchSessions(q);
                res.end(JSON.stringify(results, replaceDates));
              } else {
                next();
              }
            } else {
              next();
            }
          } catch (err) {
            console.error('API error:', err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        });
      },
    },
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

function replaceDates(_key: string, value: unknown) {
  if (value instanceof Date) return value.toISOString();
  return value;
}
