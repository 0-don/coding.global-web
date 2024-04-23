import { As, ConfigColorMode, useColorMode } from "@kobalte/core";
import { IconTypes } from "solid-icons";
import { AiOutlineLaptop } from "solid-icons/ai";
import { BsMoonStars } from "solid-icons/bs";
import { FiSun } from "solid-icons/fi";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { useI18nContext } from "~/lib/i18n/i18n-solid";
import { Translation } from "~/lib/i18n/i18n-types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";

const themeOptions = [
  { mode: "light", Icon: FiSun },
  { mode: "dark", Icon: BsMoonStars },
  { mode: "system", Icon: AiOutlineLaptop },
] as { mode: ConfigColorMode; Icon: IconTypes }[];

export function ThemeToggle() {
  const { LL } = useI18nContext();
  const { setColorMode } = useColorMode();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <As component={Button} variant="ghost" size="sm" class="w-9 px-0">
          <FiSun class="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <BsMoonStars class="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span class="sr-only">{LL().TOGGLE_THEME()}</span>
        </As>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <For each={themeOptions}>
          {({ mode, Icon }) => (
            <DropdownMenuItem onSelect={() => setColorMode(mode)}>
              <Icon class="mr-2 size-4" />
              <span>{LL()[mode.toUpperCase() as keyof Translation]()}</span>
            </DropdownMenuItem>
          )}
        </For>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
