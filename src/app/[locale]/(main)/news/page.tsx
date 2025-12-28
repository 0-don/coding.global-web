import { News } from "@/components/pages/news/news";
import { NewsSkeleton } from "@/components/pages/news/news-skeleton";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

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

export default async function NewsPage() {
  const t = await getTranslations();

  return (
    <Suspense fallback={<NewsSkeleton title={t("NEWS.TITLE")} />}>
      <News />
    </Suspense>
  );
}
