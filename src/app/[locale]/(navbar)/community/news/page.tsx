import { News } from "@/components/pages/news/news";
import { NewsSkeleton } from "@/components/pages/news/news-skeleton";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
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
  const queryClient = getQueryClient();

  const [, t] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.news(),
      queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
    }),
    getTranslations(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {/* <Suspense fallback={<NewsSkeleton title={t("NEWS.TITLE")} />}> */}
      <News />
      {/* </Suspense> */}
    </HydrationBoundary>
  );
}
