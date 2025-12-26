import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { getThread, getThreadPageMetadata } from "@/lib/utils/thread-metadata";
import type { GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200 } from "@/openapi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  const thread = await getThread(params.id, "dev-board");

  return getThreadPageMetadata(thread, locale, {
    title: t("MARKETPLACE.DEV_BOARD.META.TITLE"),
    description: t("MARKETPLACE.DEV_BOARD.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.DEV_BOARD.META.KEYWORDS"),
  });
}

export default async function DevBoardDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThread("dev-board", params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot["dev-board"]({ threadId: params.id }).get(),
        ),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.boardThreadMessages("dev-board", params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot["dev-board"]({ threadId: params.id }).messages.get({
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
      <BoardDetail threadId={params.id} boardType="dev-board" />
    </HydrationBoundary>
  );
}
