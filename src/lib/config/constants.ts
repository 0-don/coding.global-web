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

// // Helper type for the recursive part
// type TranslationKeyHelper<T> = T extends object
//   ?
//       | (keyof T & string)
//       | {
//           [K in keyof T & string]: K extends string
//             ? `${K}.${TranslationKeyHelper<T[K]>}`
//             : never;
//         }[keyof T & string]
//   : never;

// export type TranslationKey =
//   | (keyof typeof deTranslations & string)
//   | {
//       [K in keyof typeof deTranslations & string]: K extends string
//         ? `${K}.${TranslationKeyHelper<(typeof deTranslations)[K]>}`
//         : never;
//     }[keyof typeof deTranslations & string];
