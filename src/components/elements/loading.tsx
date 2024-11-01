import { TbFidgetSpinner } from "solid-icons/tb";
import { Component } from "solid-js";
import { Badge } from "../ui/badge";
import { useLanguage } from "../provider/language-provider";

interface LoadingProps {}

export const Loading: Component<LoadingProps> = (props) => {
  const { t } = useLanguage();
  
  return (
    <Badge>
      <TbFidgetSpinner class="mr-1" />
      {t("MAIN.BUTTON.LOADING")}
    </Badge>
  );
};
