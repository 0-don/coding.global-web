import { deleteCookie, getCookie, setCookie } from "cookies-next/client";
import type { SyncStorage } from "jotai/vanilla/utils/atomWithStorage";

const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export const createJotaiCookieStorage = <T>(): SyncStorage<T> => ({
  getItem(key: string, initialValue: T): T {
    const value = getCookie(key);
    if (!value) return initialValue;
    try {
      return JSON.parse(String(value)) as T;
    } catch {
      return initialValue;
    }
  },
  setItem(key: string, value: T) {
    setCookie(key, JSON.stringify(value), { maxAge: MAX_AGE });
  },
  removeItem(key: string) {
    deleteCookie(key);
  },
});
