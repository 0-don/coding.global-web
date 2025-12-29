import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type NavigationExpansionState = Record<string, boolean>;

const STORAGE_KEY = "nav-expansion";

const navigationExpansionCookieStorage =
  createJotaiCookieStorage<NavigationExpansionState>();

export const navigationExpansionAtom = atomWithStorage<NavigationExpansionState>(
  STORAGE_KEY,
  {},
  navigationExpansionCookieStorage,
);

export const isExpandedAtom = (itemKey: string) =>
  atom((get) => {
    const state = get(navigationExpansionAtom);
    return state[itemKey] ?? false;
  });

export const toggleExpansionAtom = atom(
  null,
  (get, set, itemKey: string) => {
    const state = get(navigationExpansionAtom);
    const currentValue = state[itemKey] ?? false;
    set(navigationExpansionAtom, {
      ...state,
      [itemKey]: !currentValue,
    });
  },
);

export const setExpansionAtom = atom(
  null,
  (get, set, { itemKey, expanded }: { itemKey: string; expanded: boolean }) => {
    const state = get(navigationExpansionAtom);
    set(navigationExpansionAtom, {
      ...state,
      [itemKey]: expanded,
    });
  },
);
