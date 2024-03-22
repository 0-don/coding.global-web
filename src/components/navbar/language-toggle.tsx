import { As } from "@kobalte/core";
import { For, Show, onMount } from "solid-js";
import { Button } from "~/components/ui/button";
import { useI18nContext } from "~/i18n/i18n-solid";
import { Locales } from "~/i18n/i18n-types";
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

function initLanguage() {
  const cookieLang = parseCookie(document.cookie, clientEnv.LANGUAGE_KEY);
  const lang = (cookieLang as Locales) || baseLocale;

  loadLocaleAsync(lang);
  setLanguageCookie(lang);

  return lang;
}

export function setLanguageCookie(lang: Locales) {
  const expiryDate = new Date();
  expiryDate.setFullYear(expiryDate.getFullYear() + 1);
  document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang};expires=${expiryDate.toUTCString()};path=/`;
}

export function LanguageToggle() {
  const { setLocale, locale } = useI18nContext();

  onMount(() => setLocale(initLanguage()));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
          <Show when={locale() === "de"}>
            <span>🇩🇪</span>
          </Show>
          <Show when={locale() === "en"}>
            <span>🇺🇸</span>
          </Show>
          <span class="sr-only">Toggle language</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={locales}>
          {(locale) => (
            <DropdownMenuItem
              onSelect={() => {
                loadLocaleAsync(locale).then(() => {
                  setLanguageCookie(locale);
                  setLocale(locale);
                });
              }}
              class="flex space-x-2"
            >
              <Show when={locale === "de"}>
                <span>🇩🇪</span>
              </Show>
              <Show when={locale === "en"}>
                <span>🇺🇸</span>
              </Show>
              <span>{locale}</span>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
