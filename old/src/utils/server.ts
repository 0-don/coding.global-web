import { getRequestEvent } from "solid-js/web";
import {
  getCookie,
  getRequestHeaders,
  HTTPEvent,
  parseCookies,
} from "vinxi/http";
import { Locale } from "~/lib/i18n";
import { clientEnv } from "./env/client";

export const setCookies = () => ({
  $headers: {
    cookie: Object.entries(parseCookies())
      .map(([key, value]) => `${key}=${value}`)
      .join("; "),
  },
});

export function getPreferredLanguage(): Locale {
  const language = getCookie(clientEnv.LANGUAGE_KEY) as Locale;

  if (language) return language;

  const event = getRequestEvent();

  return acceptLanguageHeader(event?.nativeEvent) || clientEnv.LANGUAGES[0];
}

export function acceptLanguageHeader(httpEvent?: HTTPEvent): Locale | null {
  if (!httpEvent) return null;

  const headers = getRequestHeaders(httpEvent);
  const acceptLanguage = headers["accept-language"] || "";

  if (!acceptLanguage) return null;

  const languages = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().toLowerCase().split("-")[0])
    .filter((lang) => clientEnv.LANGUAGES.includes(lang as Locale)) as Locale[];

  return languages?.[0] || null;
}
