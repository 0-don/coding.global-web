"use client";

import { CompanyName, LogoImage } from "@/components/elements/utils/images";
import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useSessionHook } from "@/hook/session-hook";
import { Link, usePathname } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";
import { MobileNav } from "./mobile-nav";
import { isActiveLink, navigation } from "./navigation";

export default function Navbar() {
  const t = useTranslations();
  const session = useSessionHook();
  const pathname = usePathname();

  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  return (
    <header className="border-border bg-background/80 sticky top-0 left-0 z-9999 w-full border-b backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 md:px-6">
        {/* Mobile layout - logo left, menu right */}
        <Link href="/" className="flex items-center gap-1 md:hidden">
          <LogoImage />
          <CompanyName className="text-xl font-bold" />
        </Link>
        <div className="ml-auto flex items-center md:hidden">
          <MobileNav />
        </div>

        {/* Logo - center on mobile, left on desktop */}
        <Link href="/" className="hidden items-center gap-2 sm:flex md:mr-6">
          <LogoImage />
          <CompanyName className="text-xl font-bold" />
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex-wrap gap-1">
            {navigation(!!session?.data?.user.id).map((item) => {
              const isActive = isActiveLink(pathname, item.href);
              return (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "hover:bg-primary rounded-full bg-transparent px-4 py-2 font-semibold text-white transition-all duration-200 focus:ring-0",
                        isActive && "bg-primary",
                      )}
                    >
                      {t(item.name)}
                    </Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex items-center gap-2">
          {!session?.data?.user.id && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleLogin}
                className="hidden gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4] md:flex"
              >
                <FaDiscord className="size-5" />
                {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
              </Button>
            </div>
          )}

          <ThemeToggle />
          <LanguageToggle />

          {session?.data?.user.id && (
            <UserDropdown side="bottom" align="end">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-primary h-8 w-8 rounded-full p-0"
              >
                <UserAvatar className="h-8 w-8" />
              </Button>
            </UserDropdown>
          )}
        </div>
      </div>
    </header>
  );
}
