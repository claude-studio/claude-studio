import { resolve } from 'path';
import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin({ exclude: ['@repo/shared'] })],
    resolve: {
      alias: {
        '@repo/shared': resolve('../../packages/shared/src'),
      },
    },
    build: {
      rollupOptions: {
        external: ['electron'],
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin({ exclude: ['@repo/shared'] })],
    resolve: {
      alias: {
        '@repo/shared': resolve('../../packages/shared/src'),
      },
    },
  },
  renderer: {
    root: resolve('src/renderer'),
    build: {
      rollupOptions: {
        input: resolve('src/renderer/index.html'),
      },
    },
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
        routesDirectory: resolve('src/renderer/src/routes'),
        generatedRouteTree: resolve('src/renderer/src/routeTree.gen.ts'),
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@repo/ui': resolve('../../packages/ui/src'),
        '@repo/shared': resolve('../../packages/shared/src'),
      },
    },
  },
});
