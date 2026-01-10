import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { getThread, getThreadPageMetadata } from "@/lib/utils/thread-metadata";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const [t, thread] = await Promise.all([
    getTranslations({ locale }),
    getThread(params.id, "dev-board"),
  ]);
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
          await rpc.api.bot
            .board({ boardType: "dev-board" })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.boardThreadMessages("dev-board", params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .board({ boardType: "dev-board" })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <BoardDetail threadId={params.id} boardType="dev-board" />
    </HydrationBoundary>
  );
}
