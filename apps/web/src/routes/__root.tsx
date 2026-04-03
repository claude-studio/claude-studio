import { useEffect } from 'react';

import { useTranslation } from '@repo/i18n';
import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootLayout() {
  const { i18n, t } = useTranslation('web');

  useEffect(() => {
    document.documentElement.lang = i18n.resolvedLanguage || 'en';
    document.title = t('meta.title');

    const description = document.querySelector('meta[name="description"]');

    if (description instanceof HTMLMetaElement) {
      description.content = t('meta.description');
    }
  }, [i18n.resolvedLanguage, t]);

  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootLayout,
});
