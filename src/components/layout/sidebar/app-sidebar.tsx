"use client";

import { navigation } from "@/components/layout/nav/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useSessionHook } from "@/hook/session-hook";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { CompanyName, LogoImage } from "../../elements/utils/images";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarUser } from "./sidebar-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const t = useTranslations();
  const session = useSessionHook();

  const navMain = navigation(!!session?.data?.user.id).filter(
    (item) => !item.hidden,
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="py-0"
              render={
                <Link
                  href="/"
                  className="flex w-full items-center justify-center"
                >
                  <LogoImage />
                  <CompanyName className="text-2xl font-bold" />
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation
          title={t("MAIN.SIDEBAR.MENU.NAVIGATION")}
          items={navMain}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
