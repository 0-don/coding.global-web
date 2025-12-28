import { BoardListSkeleton } from "@/components/elements/boards/board-list-skeleton";
import { JobBoard } from "@/components/pages/marketplace/job-board";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import { loadListItemStore, serverLocale } from "@/lib/utils/server";
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
  const t = await getTranslations();
  const listItemStore = await loadListItemStore("job-board");

  return (
    <ListItemStoreProvider boardType="job-board" data={listItemStore}>
      <Suspense
        fallback={
          <BoardListSkeleton
            title={t("MARKETPLACE.JOB_BOARD.HEADING")}
            icon={HiOutlineBriefcase}
          />
        }
      >
        <JobBoard />
      </Suspense>
    </ListItemStoreProvider>
  );
}
