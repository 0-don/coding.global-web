import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { LinkHref } from "@/i18n/routing";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { use } from "react";
import { FaDiscord } from "react-icons/fa";
import { SidebarSearch } from "./sidebar-search";

export function SidebarHeader() {
  const t = use(getTranslations());

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <SidebarSearch />

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={getDiscordInviteLink() as LinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 inline-flex size-9 items-center justify-center rounded-md text-[#5865F2] transition-colors"
          >
            <FaDiscord className="size-5" />
            <span className="sr-only">
              {t("MAIN.AUTH.JOIN_DISCORD_SERVER")}
            </span>
          </Link>
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
