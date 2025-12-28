import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { Marketplace } from "@/components/pages/marketplace/marketplace";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import { loadListItemStore, serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";

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
  const [t, listItemStore] = await Promise.all([
    getTranslations(),
    loadListItemStore("marketplace"),
  ]);

  return (
    <ListItemStoreProvider boardType="marketplace" data={listItemStore}>
      {/* <Suspense
        fallback={
          <BoardListSkeleton
            title={t("MARKETPLACE.HEADING")}
            icon={HiOutlineShoppingBag}
          />
        }
      > */}
        <Marketplace />
      {/* </Suspense> */}
    </ListItemStoreProvider>
  );
}
