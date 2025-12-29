import {
  getListItemStoreKey,
  INITIAL_LIST_ITEM_STORE,
  type ListItemState,
} from "@/store/list-item-store";
import type { Locale } from "next-intl";
import { getLocale } from "next-intl/server";
import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE_KEY,
  LOCALES,
  SERVER_URL_KEY,
} from "../config/constants";
import { BoardType } from "../types";

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

export const loadListItemStore = async (
  boardType: BoardType,
): Promise<ListItemState> => {
  const cookieStore = await cookies();
  const cookieValue = cookieStore.get(getListItemStoreKey(boardType))?.value;

  if (!cookieValue) return INITIAL_LIST_ITEM_STORE;

  try {
    return { ...INITIAL_LIST_ITEM_STORE, ...JSON.parse(cookieValue) };
  } catch {
    return INITIAL_LIST_ITEM_STORE;
  }
};
