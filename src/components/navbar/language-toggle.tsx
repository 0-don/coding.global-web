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

export function LanguageToggle() {
  const { setLocale, locale } = useI18nContext();

  onMount(() => {
    const cookieLang = parseCookie(document.cookie, clientEnv.LANGUAGE_KEY);
    const lang = (cookieLang as Locales) || baseLocale;
    setLocale(lang);
    loadLocaleAsync(lang);
    document.cookie = `${clientEnv.LANGUAGE_KEY}=${lang}`;
  });

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
                  document.cookie = `${clientEnv.LANGUAGE_KEY}=${locale}`;
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
