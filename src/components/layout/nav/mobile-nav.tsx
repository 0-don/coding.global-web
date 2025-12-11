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
import { Link, usePathname } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import { LuMenu } from "react-icons/lu";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";
import { isActiveLink, navigation } from "./navigation";
import { useTranslations } from "next-intl";

export function MobileNav() {
  const t = useTranslations();
  const session = useSessionHook();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <LuMenu className="text-3xl" />
          <span className="sr-only">{t("MAIN.NAVIGATION.OPEN_MENU")}</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="z-9999 w-[300px] sm:w-[400px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LogoImage />
            <CompanyName className="text-lg font-bold" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-2">
            {navigation(!!session?.data?.user.id)
              .filter((item) => !item.hidden)
              .map((item) => {
                const isActive = isActiveLink(pathname, item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href as LinkHref}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive && "bg-primary/10 text-primary font-medium",
                    )}
                  >
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "mr-2 h-4 w-4",
                          isActive && "text-primary",
                        )}
                      />
                    )}
                    {/* {t(item.name)} */}
                  </Link>
                );
              })}
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

          {/* Language and Theme toggles */}
          <div className="flex items-center gap-2 border-t px-4 pt-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
