"use client";

import { LanguageToggle } from "@/components/toggles/language-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Image from "next/image";

import { useSessionHook } from "@/hook/session-hook";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";

export default function Navbar() {
  const t = useTranslations();
  const session = useSessionHook();
  async function handleLogin() {
    await authClient.signIn.social({
      provider: "discord",
      callbackURL: "/",
    });
  }

  return (
    <div className="fixed top-3 right-0 left-0 z-20 flex items-center justify-center">
      <div className="bg-opacity-70 flex w-fit max-w-6xl items-center justify-between gap-3 rounded-full border border-red-500 bg-black px-6 py-3 shadow-lg backdrop-blur-sm">
        <NavigationMenu>
          <NavigationMenuList className="flex-wrap gap-1">
            <NavigationMenuItem>
              <button
                onClick={() =>
                  window.open(
                    "https://disboard.org/server/693908458986143824",
                    "_blank",
                  )
                }
                className={cn(
                  navigationMenuTriggerStyle(),
                  "cursor-pointer rounded-full bg-transparent px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black focus:ring-0",
                )}
              >
                {t("MAIN.BUTTON.DISBOARD")}
              </button>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/team" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full bg-transparent px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black focus:ring-0",
                  )}
                >
                  {t("MAIN.NAVIGATION.TEAM")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem className="hidden md:block">
              <Link href="/" className="relative cursor-pointer">
                <Image
                  src="/images/cgLogo.gif"
                  alt="Logo"
                  width={60}
                  height={60}
                  className="rounded-full border-2 border-red-500"
                  unoptimized
                />
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/news" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full bg-transparent px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black focus:ring-0",
                  )}
                >
                  {t("MAIN.NAVIGATION.NEWS")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/rules" legacyBehavior passHref>
                <NavigationMenuLink
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "rounded-full bg-transparent px-4 py-2 font-semibold text-white transition-all duration-200 hover:bg-red-500 hover:text-black focus:ring-0",
                  )}
                >
                  {t("MAIN.NAVIGATION.RULES")}
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Auth buttons - shown when not logged in */}
          {!session?.data?.user.id && (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleLogin}
                className="gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4]"
              >
                <FaDiscord className="size-5" />
                {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
              </Button>
            </div>
          )}

          {/* Language toggle */}
          <LanguageToggle />

          {/* User avatar - shown when logged in */}
          {session?.data?.user.id && (
            <UserDropdown side="bottom" align="end">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 rounded-full p-0 hover:bg-red-500"
              >
                <UserAvatar className="h-8 w-8" />
              </Button>
            </UserDropdown>
          )}
        </div>
      </div>
    </div>
  );
}
