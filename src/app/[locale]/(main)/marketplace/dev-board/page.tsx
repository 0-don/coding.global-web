import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { DevBoard } from "@/components/pages/marketplace/dev-board";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { loadListItemStore, serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { HiOutlineCodeBracket } from "react-icons/hi2";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("MARKETPLACE.DEV_BOARD.META.TITLE"),
    description: t("MARKETPLACE.DEV_BOARD.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.DEV_BOARD.META.KEYWORDS"),
  });
}

export default async function DevBoardPage() {
  const queryClient = getQueryClient();

  const [, listItemStore, t] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("dev-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "dev-board" }).get()),
    }),
    loadListItemStore("dev-board"),
    getTranslations(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider boardType="dev-board" data={listItemStore}>
        <Suspense
          fallback={
            <BoardListSkeleton
              title={t("MARKETPLACE.DEV_BOARD.HEADING")}
              icon={HiOutlineCodeBracket}
            />
          }
        >
          <DevBoard />
        </Suspense>
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
