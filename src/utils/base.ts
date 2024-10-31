import { type Locale } from "~/lib/i18n";
import { clientEnv } from "./env/client";

export function parseCookie(cookie: string, key: string): string | undefined {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match?.[2];
}
export function setLanguageCookie(lang: Locale) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang};expires=${expiryDate.toUTCString()};path=/`;
}
