import React from 'react';

import { bootstrapI18n, createBrowserLocaleStorage } from '@repo/i18n';
import { createRouter, RouterProvider } from '@tanstack/react-router';

import ReactDOM from 'react-dom/client';

import { Providers } from './providers/query-provider';
import { routeTree } from './routeTree.gen';

import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-mono/400.css';
import '@repo/ui/globals.css';
import './globals.css';

const router = createRouter({ routeTree });
const localeStorage = createBrowserLocaleStorage();

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root')!;

async function main() {
  const { i18n, initialLocale } = await bootstrapI18n({
    getSavedLocale: () => localeStorage.getSavedLocale(),
  });

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Providers
        i18n={i18n}
        initialLocale={initialLocale}
        persistLocale={(locale) => localeStorage.setSavedLocale(locale)}
      >
        <RouterProvider router={router} />
      </Providers>
    </React.StrictMode>,
  );
}

void main();
