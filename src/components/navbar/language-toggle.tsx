import { As } from "@kobalte/core";
import { For, Show } from "solid-js";
import { Button } from "~/components/ui/button";
import { useI18nContext } from "~/i18n/i18n-solid";
import { locales } from "~/i18n/i18n-util";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function LanguageToggle() {
  const { setLocale, locale } = useI18nContext();

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
              onSelect={() => setLocale(locale)}
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
