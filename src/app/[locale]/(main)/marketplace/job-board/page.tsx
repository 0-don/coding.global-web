import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { JobBoard } from "@/components/pages/marketplace/job-board";
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
import { HiOutlineBriefcase } from "react-icons/hi2";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
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

export default async function JobBoardPage() {
  const queryClient = getQueryClient();

  const [, listItemStore, t] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("job-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "job-board" }).get()),
    }),
    loadListItemStore("job-board"),
    getTranslations(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider boardType="job-board" data={listItemStore}>
        {/* <Suspense
          fallback={
            <BoardListSkeleton
              title={t("MARKETPLACE.JOB_BOARD.HEADING")}
              icon={HiOutlineBriefcase}
            />
          }
        > */}
          <JobBoard />
        {/* </Suspense> */}
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
