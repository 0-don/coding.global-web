import { As } from "@kobalte/core";
import { For, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { useI18nContext } from "~/i18n/i18n-solid";
import { Locales, Translation } from "~/i18n/i18n-types";
import { baseLocale, locales } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";
import { parseCookie } from "~/utils";
import { clientEnv } from "~/utils/env/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

function setLanguageCookie(lang: Locales) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang};expires=${expiryDate.toUTCString()};path=/`;
}

const localeFlags = {
  en: "🇺🇸",
  de: "🇩🇪",
};

export default function LanguageToggle() {
  const { setLocale, locale, LL } = useI18nContext();

  onMount(() => {
    const lang =
      (parseCookie(document.cookie, clientEnv.LANGUAGE_KEY) as Locales) ||
      baseLocale;
    setLocale(lang);
    setLanguageCookie(lang);
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
          {localeFlags[locale()] || "🌍"}
          <span class="sr-only">{LL().TOGGLE_LANGUAGE()}</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={locales}>
          {(loc) => (
            <DropdownMenuItem
              onSelect={() => {
                loadLocaleAsync(loc).then(() => {
                  setLanguageCookie(loc);
                  setLocale(loc);
                });
              }}
              class="space-x-2"
            >
              <span>{localeFlags[loc]}</span>{" "}
              <span>{LL()[loc.toUpperCase() as keyof Translation]()}</span>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
