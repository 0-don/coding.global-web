"use client";

import { CompanyName, LogoImage } from "@/components/elements/utils/images";
import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";
import {
  CollapsibleNavItem,
  NavigationItems,
  NavItemFromData,
} from "./base-navigation";
import { navigation } from "./navigation";

export function MobileNav() {
  const t = useTranslations();
  const session = useSessionHook();
  const [open, setOpen] = useState(false);

  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  const navItems = navigation(!!session?.data?.user.id).filter(
    (item) => !item.hidden,
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 inline-flex size-9 items-center justify-center rounded-md transition-all md:hidden" />
        }
      >
        <LuMenu className="text-3xl" />
        <span className="sr-only">{t("MAIN.NAVIGATION.OPEN_MENU")}</span>
      </SheetTrigger>
      <SheetContent side="left" className="z-9999 flex w-75 flex-col sm:w-100">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LogoImage />
            <CompanyName className="text-lg font-bold" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <nav className={cn("flex flex-col gap-1")}>
            <NavigationItems
              items={navItems}
              onNavigate={() => setOpen(false)}
              renderItem={(itemProps) => (
                <NavItemFromData
                  key={itemProps.item.name}
                  item={itemProps.item}
                  isActive={itemProps.isActive}
                  onClick={itemProps.onClick}
                />
              )}
              renderCollapsibleItem={(collapsibleProps) => (
                <CollapsibleNavItem
                  key={collapsibleProps.item.name}
                  item={collapsibleProps.item}
                  hasCategories={collapsibleProps.hasCategories}
                  onNavigate={collapsibleProps.onNavigate}
                />
              )}
            />
          </nav>

          <div className="border-t px-4 pt-4">
            {session?.data?.user.id ? (
              <div className="flex items-center gap-3">
                <UserDropdown side="bottom" align="start">
                  <Button variant="ghost" className="h-auto justify-start p-0">
                    <UserAvatar showName className="h-8 w-8" />
                  </Button>
                </UserDropdown>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <Button
                  onClick={handleLogin}
                  className="gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4]"
                >
                  <FaDiscord className="size-5" />
                  {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t px-4 pt-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
