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
import type { LinkHref } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { FaDiscord } from "react-icons/fa";
import type { IconType } from "react-icons/lib";
import { LuMenu } from "react-icons/lu";
import { UserAvatar } from "../user/user-avatar";
import { UserDropdown } from "../user/user-dropdown";
import { isActiveLink, navigation, NavigationItem } from "./navigation";
import type { TranslationKey } from "@/lib/config/constants";

function groupByCategory(items: NavigationItem[]) {
  const groups: { category: TranslationKey | null; items: NavigationItem[] }[] = [];
  const categoryMap = new Map<TranslationKey | null, NavigationItem[]>();

  for (const item of items) {
    const cat = item.category || null;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat)!.push(item);
  }

  for (const [category, categoryItems] of categoryMap) {
    groups.push({ category, items: categoryItems });
  }

  return groups;
}

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
      <SheetTrigger
        render={
          <button className="hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 inline-flex size-9 items-center justify-center rounded-md transition-all md:hidden" />
        }
      >
        <LuMenu className="text-3xl" />
        <span className="sr-only">{t("MAIN.NAVIGATION.OPEN_MENU")}</span>
      </SheetTrigger>
      <SheetContent side="left" className="z-9999 w-75 sm:w-100">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LogoImage />
            <CompanyName className="text-lg font-bold" />
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <nav className="flex flex-col gap-1">
            {navigation(!!session?.data?.user.id)
              .filter((item) => !item.hidden)
              .map((item) => {
                const isActive = isActiveLink(pathname, item.href);

                // If item has submenu, render as expandable section with clickable parent
                if (item.submenu) {
                  const groups = groupByCategory(item.submenu);
                  return (
                    <div key={item.name} className="space-y-1">
                      <ListItem
                        href={item.href}
                        icon={item.icon}
                        isActive={isActive}
                        onClick={() => setOpen(false)}
                      >
                        {t(item.name)}
                      </ListItem>
                      <div className="ml-6 space-y-2">
                        {groups.map((group) => (
                          <div key={group.category || "default"}>
                            {group.category && (
                              <span className="text-muted-foreground px-3 py-1 text-xs font-semibold uppercase">
                                {t(group.category)}
                              </span>
                            )}
                            <ul className="space-y-1">
                              {group.items.map((subItem) => {
                                const isSubActive = isActiveLink(
                                  pathname,
                                  subItem.href,
                                );
                                return (
                                  <ListItem
                                    key={subItem.name}
                                    href={subItem.href}
                                    icon={subItem.icon}
                                    isActive={isSubActive}
                                    onClick={() => setOpen(false)}
                                  >
                                    {t(subItem.name)}
                                  </ListItem>
                                );
                              })}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                // Regular item without submenu
                return (
                  <ListItem
                    key={item.name}
                    href={item.href}
                    icon={item.icon}
                    isActive={isActive}
                    onClick={() => setOpen(false)}
                  >
                    {t(item.name)}
                  </ListItem>
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

          <div className="flex items-center gap-2 border-t px-4 pt-4">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

type ListItemProps = {
  children: React.ReactNode;
  href: LinkHref;
  icon?: IconType;
  isActive?: boolean;
  onClick?: () => void;
};

function ListItem(props: ListItemProps) {
  return (
    <li className="list-none">
      <Link
        href={props.href}
        onClick={props.onClick}
        className={cn(
          "hover:bg-accent hover:text-accent-foreground flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
          props.isActive && "bg-primary/10 text-primary",
        )}
      >
        {props.icon && <props.icon className="size-4" />}
        <span>{props.children}</span>
      </Link>
    </li>
  );
}
