import { useEffect } from 'react';

import { useAppLocale, useTranslation } from '@repo/i18n';
import { createRootRoute, Outlet } from '@tanstack/react-router';

function RootLayout() {
  const { locale } = useAppLocale();
  const { t } = useTranslation('web');

  useEffect(() => {
    document.documentElement.lang = locale;
    document.title = t('meta.title');

    const description = document.querySelector('meta[name="description"]');

    if (description instanceof HTMLMetaElement) {
      description.content = t('meta.description');
    }
  }, [locale, t]);

  return <Outlet />;
}

export const Route = createRootRoute({
  component: RootLayout,
});
