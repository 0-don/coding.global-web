import { News } from "@/components/pages/news";
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
    title: t("NEWS.META.TITLE"),
    description: t("NEWS.META.DESCRIPTION"),
    keywords: t("NEWS.META.KEYWORDS"),
  });
}

export default function NewsPage() {
  return <News />;
}
