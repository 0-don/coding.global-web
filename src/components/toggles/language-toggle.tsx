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
import { Locale, useLocale, useTranslations } from "next-intl";
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

  function onLanguageChange(newLocale: Locale) {
    startTransition(() => {
      router.replace(pathname as "/", { locale: newLocale });
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            title={t("MAIN.TOOLTIP.TOGGLE_LANGUAGE")}
            disabled={isPending}
          >
            <span className="text-lg">{currentLanguage?.flag}</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code.toLowerCase() as Locale)}
          >
            <span className="mr-2 text-lg">{lang.flag}</span>
            {t(`MAIN.ENUM.${lang.code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
