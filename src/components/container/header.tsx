import { A } from "@solidjs/router";
import { HiSolidHomeModern } from "solid-icons/hi";
import { Component, JSX } from "solid-js";
import { Button } from "~/components/ui/button";
import { DictionaryKey } from "~/lib/i18n";
import { cn } from "~/lib/utils";
import { useLanguage } from "../provider/language-provider";

interface HeaderProps {
  className?: string;
  name: DictionaryKey;
  children?: JSX.Element;
}

export const Header: Component<HeaderProps> = (props) => {
  const { t } = useLanguage();

  return (
    <div class={cn("grid grid-cols-3 content-center", props.className)}>
      <A href="/">
        <Button size="icon" variant="destructive">
          <HiSolidHomeModern />
        </Button>
      </A>

      <h1 class="text-center text-3xl font-bold">{t(props.name)}</h1>

      <div class="flex justify-end">{props.children}</div>
    </div>
  );
};
