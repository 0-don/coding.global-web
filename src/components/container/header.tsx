import { A } from "@solidjs/router";
import { HiSolidHomeModern } from "solid-icons/hi";
import { Component } from "solid-js";
import { Button } from "~/components/ui/button";
import { DictionaryKey } from "~/lib/i18n";
import { useLanguage } from "../provider/language-provider";

interface HeaderProps {
  name: DictionaryKey;
}

export const Header: Component<HeaderProps> = (props) => {
  const { t } = useLanguage();

  return (
    <div class="grid grid-cols-3 content-center">
      <A href="/">
        <Button>
          <HiSolidHomeModern />
          <span>{t("HOME.TITLE")}</span>
        </Button>
      </A>

      <h1 class="text-center text-3xl font-bold">{t(props.name!)!}</h1>
    </div>
  );
};
