import { JobBoard } from "@/components/pages/marketplace/job-board";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ListItemState, getListItemStoreKey } from "@/store/list-item-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

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

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("job-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "job-board" }).get()),
    }),
    getCookieValue<ListItemState>(getListItemStoreKey("job-board")),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider boardType="job-board" data={listItemStore}>
        <JobBoard />
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
