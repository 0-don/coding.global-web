"use client";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import * as React from "react";
import {
  NavigationItems,
  SidebarCollapsibleItem,
  SidebarNavItem,
} from "../nav/base-navigation";
import { NavigationItem } from "../nav/navigation";

export function SidebarNavigation(
  props: {
    title: string;
    items: NavigationItem[];
  } & React.ComponentPropsWithoutRef<typeof SidebarGroup>
) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel>{props.title}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          <NavigationItems
            items={props.items}
            renderItem={(itemProps) => (
              <SidebarNavItem
                key={itemProps.item.name}
                item={itemProps.item}
                isActive={itemProps.isActive}
                onClick={itemProps.onClick}
              />
            )}
            renderCollapsibleItem={(collapsibleProps) => (
              <SidebarCollapsibleItem
                key={collapsibleProps.item.name}
                item={collapsibleProps.item}
                hasCategories={collapsibleProps.hasCategories}
                onNavigate={collapsibleProps.onNavigate}
              />
            )}
          />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
