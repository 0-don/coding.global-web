import { MarketplaceDetail } from "@/components/pages/marketplace/marketplace-detail";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { MarketplaceBoardType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import {
  detectThreadWithType,
  getThreadPageMetadata,
} from "@/lib/utils/thread-metadata";
import { GetApiByGuildIdBoardByBoardType200ItemBoardType as BoardType } from "@/openapi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  const result = await detectThreadWithType(params.id);

  if (result?.thread) {
    const { thread, boardType } = result;
    const fallback =
      boardType === "job-board"
        ? {
            title: t("MARKETPLACE.JOB_BOARD.META.TITLE"),
            description: t("MARKETPLACE.JOB_BOARD.META.DESCRIPTION"),
            keywords: t("MARKETPLACE.JOB_BOARD.META.KEYWORDS"),
          }
        : {
            title: t("MARKETPLACE.DEV_BOARD.META.TITLE"),
            description: t("MARKETPLACE.DEV_BOARD.META.DESCRIPTION"),
            keywords: t("MARKETPLACE.DEV_BOARD.META.KEYWORDS"),
          };

    return getThreadPageMetadata(thread, locale, fallback);
  }

  return getPageMetadata({
    locale,
    title: t("MARKETPLACE.META.TITLE"),
    description: t("MARKETPLACE.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.META.KEYWORDS"),
  });
}

async function detectBoardType(
  threadId: string,
): Promise<MarketplaceBoardType | null> {
  const results = await Promise.all([
    rpc.api.bot[BoardType["job-board"]]({ threadId })
      .get()
      .then((r) => (r.status === 200 ? BoardType["job-board"] : null))
      .catch(() => null),
    rpc.api.bot[BoardType["dev-board"]]({ threadId })
      .get()
      .then((r) => (r.status === 200 ? BoardType["dev-board"] : null))
      .catch(() => null),
  ]);

  return results.find((r) => r !== null) || null;
}

export default async function MarketplaceDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();
  const boardType = await detectBoardType(params.id);

  if (boardType) {
    await Promise.all([
      queryClient.prefetchQuery({
        queryKey: queryKeys.boardThread(boardType, params.id),
        queryFn: async () =>
          handleElysia(
            await rpc.api.bot[boardType]({ threadId: params.id }).get(),
          ),
      }),
      queryClient.prefetchInfiniteQuery({
        queryKey: queryKeys.boardThreadMessages(boardType, params.id),
        queryFn: async () =>
          handleElysia(
            await rpc.api.bot[boardType]({
              threadId: params.id,
            }).messages.get(),
          ),
        initialPageParam: undefined,
      }),
    ]);
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <MarketplaceDetail threadId={params.id} boardType={boardType!} />
    </HydrationBoundary>
  );
}
