import { As } from "@kobalte/core";
import { BsMoonStars } from "solid-icons/bs";
import { FiSun } from "solid-icons/fi";
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
  const { setLocale } = useI18nContext();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
          <FiSun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BsMoonStars class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">Toggle language</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={locales}>
          {(locale) => (
            <DropdownMenuItem onSelect={() => setLocale(locale)}>
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
