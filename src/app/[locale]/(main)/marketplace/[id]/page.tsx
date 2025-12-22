import { MarketplaceDetail } from "@/components/pages/marketplace/marketplace-detail";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
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

export default async function MarketplaceDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  // Strategy: Try to fetch from both boards and prefetch whichever succeeds
  let boardType: "job-board" | "dev-board" | null = null;

  try {
    const jobBoardAttempt = await rpc.api.bot["job-board"]({
      threadId: params.id,
    }).get();

    if (jobBoardAttempt.status === 200) {
      boardType = "job-board";
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: queryKeys.boardThread("job-board", params.id),
          queryFn: async () => handleElysia(jobBoardAttempt),
        }),
        queryClient.prefetchInfiniteQuery({
          queryKey: queryKeys.boardThreadMessages("job-board", params.id),
          queryFn: async ({ pageParam }) =>
            handleElysia(
              await rpc.api.bot["job-board"]({
                threadId: params.id,
              }).messages.get({
                query: { after: pageParam },
              }),
            ),
          initialPageParam: undefined,
          getNextPageParam: (lastPage) =>
            lastPage?.hasMore ? lastPage.nextCursor : undefined,
        }),
      ]);
    }
  } catch (error) {
    // Job board fetch failed, try dev board
  }

  if (!boardType) {
    try {
      const devBoardAttempt = await rpc.api.bot["dev-board"]({
        threadId: params.id,
      }).get();

      if (devBoardAttempt.status === 200) {
        boardType = "dev-board";
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: queryKeys.boardThread("dev-board", params.id),
            queryFn: async () => handleElysia(devBoardAttempt),
          }),
          queryClient.prefetchInfiniteQuery({
            queryKey: queryKeys.boardThreadMessages("dev-board", params.id),
            queryFn: async ({ pageParam }) =>
              handleElysia(
                await rpc.api.bot["dev-board"]({
                  threadId: params.id,
                }).messages.get({
                  query: { after: pageParam },
                }),
              ),
            initialPageParam: undefined,
            getNextPageParam: (lastPage) =>
              lastPage?.hasMore ? lastPage.nextCursor : undefined,
          }),
        ]);
      }
    } catch (error) {
      // Dev board fetch also failed
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketplaceDetail threadId={params.id} boardType={boardType} />
    </HydrationBoundary>
  );
}
