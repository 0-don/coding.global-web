"use client";

import {
  navigation,
  NavigationItem,
} from "@/components/layout/nav/navigation";
import { usePathname } from "@/i18n/navigation";
import {
  expandNavigationItemsAtom,
  findExpandedParents,
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
    const parentKeys = findExpandedParents(navItems, pathname);
    expandItems(parentKeys);
  }, [pathname, items, authenticated, expandItems]);
}
