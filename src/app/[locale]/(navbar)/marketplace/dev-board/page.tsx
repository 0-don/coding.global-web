import { DevBoard } from "@/components/pages/marketplace/dev-board";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ThreadState, getThreadStoreKey } from "@/store/thread-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

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

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads("dev-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.thread({ threadType: "dev-board" }).get()),
    }),
    getCookieValue<ThreadState>(getThreadStoreKey("dev-board")),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadStoreProvider threadType="dev-board" data={listItemStore}>
        <DevBoard />
      </ThreadStoreProvider>
    </HydrationBoundary>
  );
}
