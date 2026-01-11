"use client";

import { navigation, NavigationItem } from "@/components/layout/nav/navigation";
import { usePathname } from "@/i18n/navigation";
import {
  buildPathToParentsMap,
  expandNavigationItemsAtom,
} from "@/store/navigation-store";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

export function useNavigationAutoExpand(
  items?: NavigationItem[],
  authenticated?: boolean,
) {
  const pathname = usePathname();
  const expandItems = useSetAtom(expandNavigationItemsAtom);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    const navItems = items ?? navigation(authenticated);
    const pathToParents = buildPathToParentsMap(navItems);

    // Try exact match first
    let parentKeys: string[] = [];
    if (pathToParents.has(pathname)) {
      parentKeys = pathToParents.get(pathname)!;
    } else {
      // Try prefix match (for nested routes like /resources/guides/vibe-coding/something)
      for (const [href, parents] of pathToParents) {
        if (pathname.startsWith(href + "/") || pathname === href) {
          parentKeys = parents;
          break;
        }
      }
    }

    expandItems(parentKeys);
  }, [pathname, items, authenticated, expandItems]);
}
