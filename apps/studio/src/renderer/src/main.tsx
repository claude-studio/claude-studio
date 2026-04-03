import React from 'react';

import { bootstrapI18n, detectBrowserLocale } from '@repo/i18n';
import { createHashHistory, createRouter, RouterProvider } from '@tanstack/react-router';

import ReactDOM from 'react-dom/client';

import { Providers } from './providers/query-provider';
import { routeTree } from './routeTree.gen';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-mono/400.css';
import './globals.css';

const hashHistory = createHashHistory();
const router = createRouter({ routeTree, history: hashHistory });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root')!;

async function main() {
  const { i18n, initialLocale } = await bootstrapI18n({
    detectLocale: detectBrowserLocale(),
    getSavedLocale: () => window.electronAPI.getAppLocale(),
  });

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Providers i18n={i18n} initialLocale={initialLocale}>
        <RouterProvider router={router} />
      </Providers>
    </React.StrictMode>,
  );
}

void main();
