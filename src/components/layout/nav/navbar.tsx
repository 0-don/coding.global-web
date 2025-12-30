"use client";

import { CompanyName, LogoImage } from "@/components/elements/utils/images";
import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useSessionHook } from "@/hook/session-hook";
import { Link, usePathname } from "@/i18n/navigation";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
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
  const isLoggedIn = !!session?.data?.user.id;

  return (
    <header className="bg-background/80 sticky top-0 left-0 z-9999 w-full backdrop-blur-md">
      <div className="container mx-auto flex h-12 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-1 md:hidden">
          <LogoImage />
          <CompanyName className="text-xl font-bold" />
        </Link>
        <div className="ml-auto flex items-center md:hidden">
          <MobileNav />
        </div>

        <Link href="/" className="hidden items-center gap-2 sm:flex md:mr-6">
          <LogoImage />
          <CompanyName className="text-xl font-bold" />
        </Link>

        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList className="flex-wrap gap-1">
            {navigation(isLoggedIn).map((item) => {
              const isActive = isActiveLink(pathname, item.href);

              if (item.submenu) {
                return (
                  <NavigationMenuItem key={item.name}>
                    <NavigationMenuTrigger
                      nativeButton={false}
                      render={
                        <Link
                          href={item.href}
                          className={cn(
                            "bg-transparent",
                            isActive && "bg-primary text-primary-foreground",
                          )}
                        >
                          {t(item.name)}
                          <ChevronDownIcon
                            className="relative top-px ml-1 size-3 transition duration-300 group-data-open/navigation-menu-trigger:rotate-180 group-data-popup-open/navigation-menu-trigger:rotate-180"
                            aria-hidden="true"
                          />
                        </Link>
                      }
                    />
                    <NavigationMenuContent>
                      <ul className="grid gap-1">
                        {item.submenu.map((subItem) => {
                          if (subItem.submenu?.length) {
                            return (
                              <li
                                key={subItem.name}
                                className="group/nested relative"
                              >
                                <div className="hover:bg-muted flex cursor-pointer items-center justify-between gap-2 rounded-sm p-2 text-sm transition-all">
                                  <div className="flex items-center gap-2">
                                    <subItem.icon className="size-4" />
                                    <span className="font-medium">
                                      {t(subItem.name)}
                                    </span>
                                  </div>
                                  <ChevronRightIcon className="size-4" />
                                </div>
                                <div className="bg-popover ring-foreground/10 invisible absolute top-0 left-full z-50 ml-1 min-w-48 rounded-md p-2 opacity-0 shadow-md ring-1 transition-all group-hover/nested:visible group-hover/nested:opacity-100">
                                  <ul className="grid gap-1">
                                    {subItem.submenu.map((nestedItem) => (
                                      <li key={nestedItem.name}>
                                        <Link
                                          href={nestedItem.href}
                                          className={cn(
                                            "hover:bg-muted flex items-center gap-2 rounded-sm p-2 text-sm transition-all",
                                            isActiveLink(
                                              pathname,
                                              nestedItem.href,
                                            ) && "bg-primary/10 text-primary",
                                          )}
                                        >
                                          <nestedItem.icon className="size-4" />
                                          <span className="font-medium">
                                            {t(nestedItem.name)}
                                          </span>
                                        </Link>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </li>
                            );
                          }

                          const isSubActive = isActiveLink(
                            pathname,
                            subItem.href,
                          );
                          return (
                            <li key={subItem.name}>
                              <NavigationMenuLink
                                render={
                                  <Link
                                    href={subItem.href}
                                    className={cn(
                                      "flex items-center gap-2",
                                      isSubActive &&
                                        "bg-primary/10 text-primary",
                                    )}
                                  >
                                    {subItem.icon && (
                                      <subItem.icon className="size-4" />
                                    )}
                                    <span className="text-sm font-medium">
                                      {t(subItem.name)}
                                    </span>
                                  </Link>
                                }
                              />
                            </li>
                          );
                        })}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                );
              }

              return (
                <NavigationMenuItem key={item.name}>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "bg-transparent",
                      isActive && "bg-primary text-primary-foreground",
                    )}
                    render={<Link href={item.href}>{t(item.name)}</Link>}
                  />
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {!isLoggedIn && (
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "discord",
                  callbackURL: "/",
                })
              }
              className="hidden gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4] md:flex"
            >
              <FaDiscord className="size-5" />
              {t("MAIN.AUTH.LOGIN_WITH_DISCORD")}
            </Button>
          )}

          <ThemeToggle />
          <LanguageToggle />

          {isLoggedIn && (
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
