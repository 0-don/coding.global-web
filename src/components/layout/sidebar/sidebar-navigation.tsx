"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";
import {
  isActiveLink,
  NavigationItem,
  groupByCategory,
} from "../nav/navigation";

export function SidebarNavigation({
  title,
  items,
  ...props
}: {
  title: string;
  items: NavigationItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const t = useTranslations();
  const pathname = usePathname();

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = isActiveLink(pathname, item.href);
            const hasSubmenu = item.submenu && item.submenu.length > 0;

            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  tooltip={t(item.name)}
                  isActive={isActive}
                  className={cn(
                    isActive && "bg-primary/10 text-primary font-medium",
                  )}
                >
                  <Link
                    href={item.href as LinkHref}
                    className="flex items-center gap-2"
                  >
                    <item.icon className={cn(isActive && "text-primary")} />
                    <span>{t(item.name)}</span>
                  </Link>
                </SidebarMenuButton>
                {hasSubmenu && (
                  <SidebarMenuSub>
                    {groupByCategory(item.submenu!).map((group) => (
                      <React.Fragment key={group.category || "default"}>
                        {group.category && (
                          <li className="text-muted-foreground px-2 py-1.5 text-xs font-semibold uppercase">
                            {t(group.category)}
                          </li>
                        )}
                        {group.items.map((subItem) => {
                          const isSubActive = isActiveLink(
                            pathname,
                            subItem.href,
                          );
                          return (
                            <SidebarMenuSubItem key={subItem.name}>
                              <SidebarMenuSubButton
                                isActive={isSubActive}
                                className={cn(
                                  isSubActive &&
                                    "bg-primary/10 text-primary font-medium",
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
                        })}
                      </React.Fragment>
                    ))}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
