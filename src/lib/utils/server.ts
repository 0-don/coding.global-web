import type { Locale } from "next-intl";
import { getLocale } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE_KEY,
  LOCALES,
  SERVER_URL_KEY,
} from "../config/constants";
import { GetApiByGuildIdThreadByThreadTypeByThreadId200 } from "@/openapi";
import { rpc } from "../rpc";
import { ThreadType } from "../types";

export const serverUrl = async () => (await headers()).get(SERVER_URL_KEY);

const safe = async <T>(fn: () => Promise<T>): Promise<T | undefined> => {
  try {
    return await fn();
  } catch {
    return undefined;
  }
};

export const serverLocale = async (props?: {
  params: Promise<{ locale: string }>;
}) =>
  ((await safe(async () => (await props?.params)?.locale)) ||
    (await safe(getLocale)) ||
    (await safe(async () => (await cookies()).get(LOCALE_COOKIE_KEY)?.value)) ||
    LOCALES[0]) as Locale;

export const getCookieValue = async <T>(
  key: string,
): Promise<T | undefined> => {
  const cookieStore = await cookies();
  try {
    return JSON.parse(cookieStore.get(key)?.value ?? "");
  } catch (error) {
    return undefined;
  }
};

export async function getThread(
  threadId: string,
  threadType: ThreadType,
): Promise<GetApiByGuildIdThreadByThreadTypeByThreadId200 | null> {
  try {
    const response = await rpc.api.bot
      .thread({ threadType })({ threadId })
      .get();
    if (response.status === 200) {
      return response.data;
    }
  } catch {
    // Fall back to default metadata
  }
  return null;
}
