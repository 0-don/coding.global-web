"use client";

import { MobileNavigationContent } from "@/components/layout/nav/mobile-navigation-content";
import { navigation } from "@/components/layout/nav/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useSessionHook } from "@/hook/session-hook";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import * as React from "react";
import { CompanyName, LogoImage } from "../../elements/utils/images";
import { SidebarNavigation } from "./sidebar-navigation";
import { SidebarUser } from "./sidebar-user";

function SidebarDesktopContent(props: {
  navMain: ReturnType<typeof navigation>;
}) {
  const t = useTranslations();

  return (
    <>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="py-0"
              render={
                <Link
                  href="/"
                  className="flex w-full items-center gap-2 group-data-[collapsible=icon]:justify-center"
                >
                  <LogoImage className="shrink-0" />
                  <CompanyName className="text-2xl font-bold group-data-[collapsible=icon]:hidden" />
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarNavigation
          title={t("MAIN.SIDEBAR.MENU.NAVIGATION")}
          items={props.navMain}
        />
      </SidebarContent>
      <SidebarFooter>
        <SidebarUser />
      </SidebarFooter>
    </>
  );
}

function SidebarMobileContent(props: { onNavigate?: () => void }) {
  return (
    <MobileNavigationContent
      showHeader
      onNavigate={props.onNavigate}
      className="px-2"
    />
  );
}

function AppSidebarContent() {
  const session = useSessionHook();
  const { isMobile, setOpenMobile } = useSidebar();

  const navMain = navigation(!!session?.data?.user.id).filter(
    (item) => !item.hidden,
  );

  if (isMobile) {
    return <SidebarMobileContent onNavigate={() => setOpenMobile(false)} />;
  }

  return <SidebarDesktopContent navMain={navMain} />;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <AppSidebarContent />
    </Sidebar>
  );
}
