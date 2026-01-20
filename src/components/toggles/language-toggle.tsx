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
import { useParams } from "next/navigation";
import posthog from "posthog-js";
import { useTransition } from "react";

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const t = useTranslations();
  const [isPending, startTransition] = useTransition();

  const currentLanguage = LANGUAGES.find(
    (lang) => lang.code.toLowerCase() === locale.toLowerCase(),
  );

  function onLanguageChange(newLocale: Locale) {
    posthog.capture("language_changed", {
      previous_language: locale,
      new_language: newLocale,
    });
    startTransition(() => {
      router.replace(
        // @ts-expect-error - dynamic params are passed separately
        { pathname, params },
        { locale: newLocale },
      );
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
            {currentLanguage && <currentLanguage.Flag className="h-5 w-7" />}
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => onLanguageChange(lang.code.toLowerCase() as Locale)}
            className={"cursor-pointer"}
          >
            <lang.Flag className="mr-2 h-4 w-6" />
            {t(`MAIN.ENUM.${lang.code}`)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
