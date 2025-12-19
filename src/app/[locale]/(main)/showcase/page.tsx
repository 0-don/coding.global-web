import { ShowcaseList } from "@/components/pages/showcase/showcase";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
  });
}

export default async function ShowcasePage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.showcaseThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot.showcase.get()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShowcaseList />
    </HydrationBoundary>
  );
}
