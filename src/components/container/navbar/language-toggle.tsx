import { For, onMount } from "solid-js";
import { useLanguage } from "~/components/provider/language-provider";
import { Button } from "~/components/ui/button";
import { baseLocale, Locale } from "~/lib/i18n";
import { parseCookie } from "~/utils/base";
import { clientEnv } from "~/utils/env/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

function setLanguageCookie(lang: Locale) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang};expires=${expiryDate.toUTCString()};path=/`;
}

const localeFlags = {
  en: "🇺🇸",
  de: "🇩🇪",
};

export default function LanguageToggle() {
  const { t, setLocale, locale } = useLanguage();

  onMount(() => {
    const lang =
      (parseCookie(document.cookie, clientEnv.LANGUAGE_KEY) as Locale) ||
      baseLocale;
    setLocale(lang);
    setLanguageCookie(lang);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        as={Button<"button">}
        variant="ghost"
        size="sm"
        class="w-9 px-0"
      >
        {(localeFlags as any)[locale()] || "🌍"}
        <span class="sr-only">{t("MAIN.TOOLTIP.TOGGLE_LANGUAGE")}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={clientEnv.LANGUAGES}>
          {(loc) => (
            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => {
                  setLanguageCookie(loc);
                  setLocale(loc);
                }, 150);
              }}
              class="space-x-2"
            >
              <span>{localeFlags[loc]}</span>{" "}
              <span>{t(loc.toUpperCase() as any)}</span>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
