import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { DevBoard } from "@/components/pages/marketplace/dev-board";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import { loadListItemStore, serverLocale } from "@/lib/utils/server";
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
  const t = await getTranslations();
  const listItemStore = await loadListItemStore("dev-board");

  return (
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
  );
}
