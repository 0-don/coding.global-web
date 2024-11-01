import { TbFidgetSpinner } from "solid-icons/tb";
import { Component } from "solid-js";
import { useLanguage } from "../provider/language-provider";
import { Badge } from "../ui/badge";

interface LoadingProps {}

export const Loading: Component<LoadingProps> = (props) => {
  const { t } = useLanguage();

  return (
    <div class="flex w-full justify-center">
      <Badge class="text-base">
        <TbFidgetSpinner class="mr-1 animate-spin" />
        {t("MAIN.BUTTON.LOADING")}
        <span class="inline-block after:animate-[dots_1.5s_infinite] after:content-['.']" />
      </Badge>
    </div>
  );
};
