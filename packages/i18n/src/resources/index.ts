import en from './en';
import ko from './ko';

export const resources = {
  en,
  ko,
} as const;

export type ResourceLocale = keyof typeof resources;
