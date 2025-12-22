import { Marketplace } from "@/components/pages/marketplace/marketplace";
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
    title: t("MARKETPLACE.META.TITLE"),
    description: t("MARKETPLACE.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.META.KEYWORDS"),
  });
}

export default async function MarketplacePage() {
  const queryClient = getQueryClient();

  // Prefetch BOTH job-board and dev-board data in parallel
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.jobBoardThreads(),
      queryFn: async () => handleElysia(await rpc.api.bot["job-board"].get()),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.devBoardThreads(),
      queryFn: async () => handleElysia(await rpc.api.bot["dev-board"].get()),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Marketplace />
    </HydrationBoundary>
  );
}
