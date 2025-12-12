"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "@/i18n/navigation";
import { LANGUAGES } from "@/lib/config/constants";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = LANGUAGES.find(
    (lang) => lang.code.toLowerCase() === locale,
  );

  function onLanguageChange(newLocale: string) {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale as "en" | "de" });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 border border-primary bg-black/70 text-white hover:bg-primary hover:text-primary-foreground"
          title={t("MAIN.TOOLTIP.TOGGLE_LANGUAGE")}
          disabled={isPending}
        >
          <span className="text-lg">{currentLanguage?.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-primary bg-black/90">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code.toLowerCase())}
            className="hover:bg-primary hover:text-primary-foreground"
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {t(`MAIN.ENUM.${lang.code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
