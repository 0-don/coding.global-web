"use client";

import {
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import type { TranslationKey } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import {
  navigationExpansionAtom,
  toggleExpansionAtom,
} from "@/store/navigation-expansion-store";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { isActiveLink, NavigationItem } from "../nav/navigation";

export function SidebarCategoryGroup({
  category,
  items,
}: {
  category: TranslationKey | null;
  items: NavigationItem[];
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expansionState] = useAtom(navigationExpansionAtom);
  const toggleExpansion = useSetAtom(toggleExpansionAtom);

  const categoryKey = category || "uncategorized";
  const isExpanded = expansionState[categoryKey] ?? false;

  if (!category) {
    return (
      <>
        {items.map((item) => {
          const isActive = isActiveLink(pathname, item.href);
          return (
            <SidebarMenuSubItem key={item.name}>
              <SidebarMenuSubButton
                isActive={isActive}
                className={cn(
                  isActive && "bg-primary/10 text-primary font-medium",
                )}
                render={
                  <Link
                    href={item.href as LinkHref}
                    className="flex items-center gap-2"
                  >
                    <item.icon
                      className={cn("size-4", isActive && "text-primary")}
                    />
                    <span>{t(item.name)}</span>
                  </Link>
                }
              />
            </SidebarMenuSubItem>
          );
        })}
      </>
    );
  }

  return (
    <li className="flex flex-col">
      <button
        type="button"
        onClick={() => toggleExpansion(categoryKey)}
        className="text-muted-foreground hover:text-foreground flex items-center justify-between px-2 py-1.5 text-xs font-semibold uppercase transition-colors"
      >
        <span>{t(category)}</span>
        <ChevronRight
          className={cn(
            "size-3 transition-transform duration-200",
            isExpanded && "rotate-90",
          )}
        />
      </button>
      {isExpanded && (
        <ul className="flex flex-col gap-1 pl-2">
          {items.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            return (
              <SidebarMenuSubItem key={item.name}>
                <SidebarMenuSubButton
                  isActive={isActive}
                  className={cn(
                    isActive && "bg-primary/10 text-primary font-medium",
                  )}
                  render={
                    <Link
                      href={item.href as LinkHref}
                      className="flex items-center gap-2"
                    >
                      <item.icon
                        className={cn("size-4", isActive && "text-primary")}
                      />
                      <span>{t(item.name)}</span>
                    </Link>
                  }
                />
              </SidebarMenuSubItem>
            );
          })}
        </ul>
      )}
    </li>
  );
}
