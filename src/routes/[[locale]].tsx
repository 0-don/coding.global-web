import { RouteSectionProps } from "@solidjs/router";
import { MetaHead } from "~/components/elements/meta-head";
import { useLanguage } from "~/components/provider/language-provider";

export default function (props: RouteSectionProps) {
  const { t } = useLanguage();

  return (
    <>
      <MetaHead
        title={t("MAIN.META.TITLE")!}
        description={t("MAIN.META.DESCRIPTION")!}
        keywords={t("MAIN.META.KEYWORDS")}
      />

      {props.children}
    </>
  );
}
