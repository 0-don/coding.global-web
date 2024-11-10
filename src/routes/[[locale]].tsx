import { RouteSectionProps } from "@solidjs/router";
import { useLanguage } from "~/components/provider/language-provider";
import { MetaHead } from "~/components/provider/meta-head";

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
