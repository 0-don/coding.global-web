import { CodingIndex } from "@/components/pages/community/coding/coding-index";
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
    title: t("CODING.META.TITLE"),
    description: t("CODING.META.DESCRIPTION"),
    keywords: t("CODING.META.KEYWORDS"),
  });
}

export default function CodingPage() {
  return <CodingIndex />;
}
