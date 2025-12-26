import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import type { GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200 } from "@/openapi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("MARKETPLACE.JOB_BOARD.META.TITLE"),
    description: t("MARKETPLACE.JOB_BOARD.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.JOB_BOARD.META.KEYWORDS"),
  });
}

export default async function JobBoardDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThread("job-board", params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot["job-board"]({ threadId: params.id }).get(),
        ),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.boardThreadMessages("job-board", params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot["job-board"]({ threadId: params.id }).messages.get({
            query: { after: pageParam },
          }),
        ),
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (
        lastPage: GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200 | null,
      ) => (lastPage?.hasMore ? (lastPage.nextCursor ?? undefined) : undefined),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardDetail threadId={params.id} boardType="job-board" />
    </HydrationBoundary>
  );
}
