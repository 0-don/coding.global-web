import { NavigationItem } from "@/components/layout/nav/navigation";
import { createJotaiCookieStorage } from "@/lib/utils/jotai-cookie-storage";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type NavigationExpandedState = Record<string, boolean>;

export type NavigationState = {
  expanded: NavigationExpandedState;
  sidebarOpen: boolean;
};

/**
 * Builds a map from href paths to the list of parent navigation keys
 * that need to be expanded to show that path.
 */
export function buildPathToParentsMap(
  items: NavigationItem[],
  parentKeys: string[] = [],
): Map<string, string[]> {
  const map = new Map<string, string[]>();

  for (const item of items) {
    const href = typeof item.href === "string" ? item.href : String(item.href);

    // Store the parent keys for this href
    if (parentKeys.length > 0) {
      map.set(href, [...parentKeys]);
    }

    // If this item has a submenu, recurse with this item added to parent keys
    if (item.submenu && item.submenu.length > 0) {
      const childMap = buildPathToParentsMap(item.submenu, [
        ...parentKeys,
        item.name,
      ]);
      // Merge child map into main map
      for (const [childHref, childParents] of childMap) {
        map.set(childHref, childParents);
      }
    }
  }

  return map;
}

/**
 * Finds all parent navigation item keys that should be expanded
 * for the given pathname to show the active item.
 */
export function findExpandedParents(
  items: NavigationItem[],
  pathname: string,
): string[] {
  const pathToParents = buildPathToParentsMap(items);

  // Try exact match first
  if (pathToParents.has(pathname)) {
    return pathToParents.get(pathname)!;
  }

  // Try prefix match (for nested routes like /resources/guides/vibe-coding/something)
  for (const [href, parents] of pathToParents) {
    if (pathname.startsWith(href + "/") || pathname === href) {
      return parents;
    }
  }

  return [];
}

export const NAVIGATION_STORE_KEY = "navigation-store";

export const INITIAL_NAVIGATION_STATE: NavigationState = {
  expanded: {},
  sidebarOpen: true,
};

const navigationCookieStorage = createJotaiCookieStorage<NavigationState>();

export const navigationAtom = atomWithStorage<NavigationState>(
  NAVIGATION_STORE_KEY,
  INITIAL_NAVIGATION_STATE,
  navigationCookieStorage,
);

// Derived atom for sidebar open state
export const sidebarOpenAtom = atom(
  (get) => get(navigationAtom).sidebarOpen,
  (get, set, value: boolean) => {
    const state = get(navigationAtom);
    set(navigationAtom, {
      ...state,
      sidebarOpen: value,
    });
  },
);

export const toggleSidebarAtom = atom(null, (get, set) => {
  const state = get(navigationAtom);
  set(navigationAtom, {
    ...state,
    sidebarOpen: !state.sidebarOpen,
  });
});

export const toggleNavigationAtom = atom(null, (get, set, itemKey: string) => {
  const state = get(navigationAtom);
  const currentValue = state.expanded[itemKey] ?? false;
  set(navigationAtom, {
    ...state,
    expanded: {
      ...state.expanded,
      [itemKey]: !currentValue,
    },
  });
});

export const setNavigationAtom = atom(
  null,
  (get, set, { itemKey, expanded }: { itemKey: string; expanded: boolean }) => {
    const state = get(navigationAtom);
    set(navigationAtom, {
      ...state,
      expanded: {
        ...state.expanded,
        [itemKey]: expanded,
      },
    });
  },
);

export const expandNavigationItemsAtom = atom(
  null,
  (get, set, itemKeys: string[]) => {
    if (itemKeys.length === 0) return;
    const state = get(navigationAtom);
    const updates = Object.fromEntries(itemKeys.map((key) => [key, true]));
    set(navigationAtom, {
      ...state,
      expanded: { ...state.expanded, ...updates },
    });
  },
);
