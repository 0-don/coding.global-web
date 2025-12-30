import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type NavigationState = Record<string, boolean>;

export const NAVIGATION_STORE_KEY = "navigation-store";

export const INITIAL_NAVIGATION_STATE: NavigationState = {};

const navigationCookieStorage = createJotaiCookieStorage<NavigationState>();

export const navigationAtom = atomWithStorage<NavigationState>(
  NAVIGATION_STORE_KEY,
  INITIAL_NAVIGATION_STATE,
  navigationCookieStorage,
);

export const toggleNavigationAtom = atom(null, (get, set, itemKey: string) => {
  const state = get(navigationAtom);
  const currentValue = state[itemKey] ?? false;
  set(navigationAtom, {
    ...state,
    [itemKey]: !currentValue,
  });
});

export const setNavigationAtom = atom(
  null,
  (get, set, { itemKey, expanded }: { itemKey: string; expanded: boolean }) => {
    const state = get(navigationAtom);
    set(navigationAtom, {
      ...state,
      [itemKey]: expanded,
    });
  },
);
