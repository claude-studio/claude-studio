import React from 'react';

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

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const root = document.getElementById('root')!;
ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  </React.StrictMode>,
);
