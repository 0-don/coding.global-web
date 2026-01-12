import { Marketplace } from "@/components/pages/marketplace/marketplace";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { getThreadStoreKey, ThreadState } from "@/store/thread-store";
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

  const [listItemStore] = await Promise.all([
    getCookieValue<ThreadState>(getThreadStoreKey("marketplace")),
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads("job-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.thread({ threadType: "job-board" }).get()),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads("dev-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.thread({ threadType: "dev-board" }).get()),
    }),
  ]);

  return (
    <ThreadStoreProvider threadType="marketplace" data={listItemStore}>
      <Marketplace />
    </ThreadStoreProvider>
  );
}
