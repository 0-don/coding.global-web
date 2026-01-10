import { Marketplace } from "@/components/pages/marketplace/marketplace";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
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
  const listItemStore = await getCookieValue<ListItemState>(getListItemStoreKey("marketplace"));

  return (
    <ListItemStoreProvider boardType="marketplace" data={listItemStore}>
      <Marketplace />
    </ListItemStoreProvider>
  );
}
