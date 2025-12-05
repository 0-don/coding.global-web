import { Locale } from "next-intl";

export const SERVER_URL_KEY = "x-url";

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
