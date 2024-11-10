import { RouteSectionProps } from "@solidjs/router";
import { MetaHead } from "~/components/elements/meta-head";
import { useLanguage } from "~/components/provider/language-provider";

export default function (props: RouteSectionProps) {
  const { t } = useLanguage();

  return (
    <>
      <MetaHead
        title={t("HOME.META.TITLE")!}
        description={t("HOME.META.DESCRIPTION")!}
        keywords={t("HOME.META.KEYWORDS")}
      />

      {props.children}
    </>
  );
}
