import { LanguageToggle } from "@/components/toggles/language-toggle";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTranslations } from "next-intl";

export function SiteHeader() {
  const t = useTranslations();

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{t("DASHBOARD.TITLE")}</h1>

        <div className="ml-auto flex items-center gap-2">
          <LanguageToggle />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
