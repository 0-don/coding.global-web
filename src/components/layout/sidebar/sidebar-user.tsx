"use client";

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { PiDotsThreeVerticalBold } from "react-icons/pi";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";

export function SidebarUser() {
  const { isMobile } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <UserDropdown
          side={isMobile ? "bottom" : "right"}
          align="end"
          sideOffset={4}
        >
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <UserAvatar showName className="h-8 w-8" />
            <PiDotsThreeVerticalBold className="ml-auto size-4" />
          </SidebarMenuButton>
        </UserDropdown>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
