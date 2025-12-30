import { Rules } from "@/components/pages/community/rules/rules";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("RULES.META.TITLE"),
    description: t("RULES.META.DESCRIPTION"),
    keywords: t("RULES.META.KEYWORDS"),
  });
}

export default function RulesPage() {
  return <Rules />;
}
