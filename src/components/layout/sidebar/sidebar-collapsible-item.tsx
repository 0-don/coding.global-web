"use client";

import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  navigationExpansionAtom,
  toggleExpansionAtom,
} from "@/store/navigation-expansion-store";
import { useAtom, useSetAtom } from "jotai";
import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";
import {
  isActiveLink,
  NavigationItem,
  groupByCategory,
} from "../nav/navigation";
import { SidebarCategoryGroup } from "./sidebar-category-group";

export function SidebarCollapsibleItem({
  item,
  hasCategories = false,
}: {
  item: NavigationItem;
  hasCategories?: boolean;
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [expansionState] = useAtom(navigationExpansionAtom);
  const toggleExpansion = useSetAtom(toggleExpansionAtom);

  const isActive = isActiveLink(pathname, item.href);
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isExpanded = expansionState[item.name] ?? false;

  return (
    <SidebarMenuItem>
      <div className="flex items-center">
        <SidebarMenuButton
          tooltip={t(item.name)}
          isActive={isActive}
          className={cn(
            "flex-1",
            isActive && "bg-primary/10 text-primary font-medium",
          )}
        >
          <Link
            href={item.href as LinkHref}
            className="flex flex-1 items-center gap-2"
          >
            <item.icon className={cn(isActive && "text-primary")} />
            <span>{t(item.name)}</span>
          </Link>
        </SidebarMenuButton>
        {hasSubmenu && (
          <button
            type="button"
            onClick={() => toggleExpansion(item.name)}
            className="hover:bg-sidebar-accent flex size-8 items-center justify-center rounded-md transition-colors"
            aria-label={isExpanded ? "Collapse submenu" : "Expand submenu"}
          >
            <ChevronRight
              className={cn(
                "size-4 transition-transform duration-200",
                isExpanded && "rotate-90",
              )}
            />
          </button>
        )}
      </div>
      {hasSubmenu && isExpanded && (
        <SidebarMenuSub>
          {hasCategories ? (
            groupByCategory(item.submenu!).map((group) => (
              <SidebarCategoryGroup
                key={group.category || "default"}
                category={group.category}
                items={group.items}
              />
            ))
          ) : (
            item.submenu!.map((subItem) => {
              const isSubActive = isActiveLink(pathname, subItem.href);
              return (
                <SidebarMenuSubItem key={subItem.name}>
                  <SidebarMenuSubButton
                    isActive={isSubActive}
                    className={cn(
                      isSubActive && "bg-primary/10 text-primary font-medium",
                    )}
                    render={
                      <Link
                        href={subItem.href as LinkHref}
                        className="flex items-center gap-2"
                      >
                        <subItem.icon
                          className={cn(
                            "size-4",
                            isSubActive && "text-primary",
                          )}
                        />
                        <span>{t(subItem.name)}</span>
                      </Link>
                    }
                  />
                </SidebarMenuSubItem>
              );
            })
          )}
        </SidebarMenuSub>
      )}
    </SidebarMenuItem>
  );
}
