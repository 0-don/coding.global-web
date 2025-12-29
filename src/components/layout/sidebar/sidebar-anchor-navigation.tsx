"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import * as React from "react";
import type { IconType } from "react-icons/lib";

export type AnchorItem = {
  id: string;
  label: string;
  icon?: IconType;
};

export function SidebarAnchorNavigation({
  title,
  items,
  activeId,
  ...props
}: {
  title: string;
  items: AnchorItem[];
  activeId?: string;
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const t = useTranslations();

  function handleClick(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = activeId === item.id;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  tooltip={item.label}
                  isActive={isActive}
                  className={cn(
                    isActive && "bg-primary/10 text-primary font-medium",
                  )}
                  onClick={() => handleClick(item.id)}
                >
                  <a
                    href={`#${item.id}`}
                    className="flex items-center gap-2"
                    onClick={(e) => {
                      e.preventDefault();
                      handleClick(item.id);
                    }}
                  >
                    {item.icon && (
                      <item.icon className={cn(isActive && "text-primary")} />
                    )}
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
