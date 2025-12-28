import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { Showcase } from "@/components/pages/showcase/showcase";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import { loadListItemStore, serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { HiOutlineTrophy } from "react-icons/hi2";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
  });
}

export default async function ShowcasePage() {
  const t = await getTranslations();
  const listItemStore = await loadListItemStore("showcase");

  return (
    <ListItemStoreProvider boardType="showcase" data={listItemStore}>
      <Suspense
        fallback={
          <BoardListSkeleton
            title={t("SHOWCASE.HEADING")}
            icon={HiOutlineTrophy}
          />
        }
      >
        <Showcase />
      </Suspense>
    </ListItemStoreProvider>
  );
}
