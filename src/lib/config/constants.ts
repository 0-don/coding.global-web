import type { Locale, useTranslations } from "next-intl";

export const SERVER_URL_KEY = "x-url";

export const LOCALE_COOKIE_KEY = "NEXT_LOCALE";

export const PAGEABLE_LIMIT = 20;

export const LOCALES = [
  "en", // English
  "de", // German
] as const;

export const LANGUAGES: {
  code: Uppercase<Locale>;
  flag: string;
  ogLocale: string;
}[] = [
  { code: "EN", flag: "🇺🇸", ogLocale: "en-US" },
  { code: "DE", flag: "🇩🇪", ogLocale: "de-DE" },
];

export const ALTERNATE_LANGUAGES = LOCALES.reduce(
  (acc, loc) => {
    acc[loc] = `/${loc}`;
    return acc;
  },
  {} as Record<string, string>,
);

export type TranslationKey = Parameters<
  ReturnType<typeof useTranslations<never>>
>[0];

export const msg = (key: TranslationKey) => key;
