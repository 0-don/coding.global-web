import { Marketplace } from "@/components/pages/marketplace/marketplace";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { getListItemStoreKey, ListItemState } from "@/store/list-item-store";
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
    getCookieValue<ListItemState>(getListItemStoreKey("marketplace")),
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("job-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "job-board" }).get()),
    }),
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("dev-board"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "dev-board" }).get()),
    }),
  ]);

  return (
    <ListItemStoreProvider boardType="marketplace" data={listItemStore}>
      <Marketplace />
    </ListItemStoreProvider>
  );
}
