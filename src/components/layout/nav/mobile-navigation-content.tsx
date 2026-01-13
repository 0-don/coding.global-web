"use client";

import { CompanyName, LogoImage } from "@/components/elements/utils/images";
import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Button } from "@/components/ui/button";
import { useSessionHook } from "@/hook/session-hook";
import { Link } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { useTranslations } from "next-intl";
import { FaDiscord } from "react-icons/fa";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";
import {
  CollapsibleNavItem,
  NavigationItems,
  NavItemFromData,
} from "./base-navigation";
import { navigation } from "./navigation";

type MobileNavigationContentProps = {
  onNavigate?: () => void;
  showHeader?: boolean;
  className?: string;
};

export function MobileNavigationContent(props: MobileNavigationContentProps) {
  const t = useTranslations();
  const session = useSessionHook();

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
    <>
      {props.showHeader && (
        <div className="flex items-center gap-2 px-4 py-3">
          <Link href="/" onClick={props.onNavigate} className="flex items-center gap-2">
            <LogoImage />
            <CompanyName className="text-lg font-bold" />
          </Link>
        </div>
      )}

      <div className={cn("flex flex-1 flex-col gap-4 overflow-y-auto", props.className)}>
        <nav className="flex flex-col gap-1">
          <NavigationItems
            items={navItems}
            onNavigate={props.onNavigate}
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
          <a
            href={getDiscordInviteLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 flex items-center gap-2 rounded-md border border-[#5865F2] px-3 py-2 text-[#5865F2] transition-colors hover:bg-[#5865F2] hover:text-white"
          >
            <FaDiscord className="size-5" />
            {t("MAIN.AUTH.JOIN_DISCORD_SERVER")}
          </a>
          {session?.data?.user.id ? (
            <div className="flex items-center gap-3">
              <UserDropdown side="bottom" align="start">
                <Button variant="ghost" className="h-auto justify-start p-0">
                  <UserAvatar showName className="h-8 w-8" />
                </Button>
              </UserDropdown>
            </div>
          ) : (
            <Button
              onClick={handleLogin}
              className="w-full gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4]"
            >
              <FaDiscord className="size-5" />
              {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 border-t px-4 pt-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </>
  );
}
