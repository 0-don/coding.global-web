import { For } from "solid-js";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { Locale } from "~/lib/i18n";
import { setLanguageCookie } from "~/utils/base";
import { clientEnv } from "~/utils/env/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const localeFlags = {
  en: "🇺🇸",
  de: "🇩🇪",
};

export default function LanguageToggle() {
  const { t, setLocale, locale } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="sm"
        class="w-9 px-0"
      >
        {localeFlags[locale()] || "🌍"}
        <span class="sr-only">{t("MAIN.TOOLTIP.TOGGLE_LANGUAGE")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={clientEnv.LANGUAGES}>
          {(loc) => (
            <DropdownMenuItem
              onSelect={() => {
                setLanguageCookie(loc);
                setLocale(loc);
              }}
              class="space-x-2"
            >
              <span>{localeFlags[loc]}</span>{" "}
              <span>
                {t(`MAIN.ENUM.${loc.toUpperCase() as Uppercase<Locale>}`)}
              </span>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
