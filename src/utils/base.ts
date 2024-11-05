import type { EdenFetchError } from "@elysiajs/eden/dist/errors";
import type { Locale } from "~/lib/i18n";
import { clientEnv } from "./env/client";

export const getBaseUrl = () => clientEnv.BOT_URL;

export function parseCookie(cookie: string, key: string): string | undefined {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match?.[2];
}
export function setLanguageCookie(lang: Locale) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang};expires=${expiryDate.toUTCString()};path=/`;
}

export function handleEden<T>(
  response: (
    | {
        data: T;
        error: null;
      }
    | {
        data: null;
        error: EdenFetchError<number, string>;
      }
  ) & {
    status: number;
    response: Record<number, unknown>;
    headers: Record<string, string>;
  },
): T {
  if (response.error) {
    console.log("error", response.error);
    response.error.status = response.status;
    response.error.value = (
      response.response as { statusText: string }
    ).statusText;
    throw response.error;
  }
  return response.data;
}
