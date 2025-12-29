"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link, usePathname } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";
import { isActiveLink, NavigationItem } from "../nav/navigation";

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
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
