import {
  GetApiByGuildIdThreadByThreadTypeByThreadId200,
  getApiByGuildIdThreadByThreadTypeByThreadId,
} from "@/openapi";
import type { Locale } from "next-intl";
import { cookies, headers } from "next/headers";
import { LOCALES, SERVER_URL_KEY } from "../config/constants";
import { ApiThreadType } from "../types";

export const serverUrl = async () => (await headers()).get(SERVER_URL_KEY);

export const serverLocale = async (props?: {
  params: Promise<{ locale: string }>;
}): Promise<Locale> => {
  const params = await props?.params;
  return (params?.locale || LOCALES[0]) as Locale;
};

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
  threadType: ApiThreadType,
): Promise<GetApiByGuildIdThreadByThreadTypeByThreadId200 | null> {
  try {
    const response = await getApiByGuildIdThreadByThreadTypeByThreadId(
      process.env.NEXT_PUBLIC_GUILD_ID!,
      threadType,
      threadId,
    );
    if (response.status === 200) {
      return response.data;
    }
  } catch {
    // Fall back to default metadata
  }
  return null;
}
