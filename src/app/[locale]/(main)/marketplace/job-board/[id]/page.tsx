import { ThreadDetailSkeleton } from "@/components/elements/thread/thread-detail-skeleton";
import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import { serverLocale } from "@/lib/utils/server";
import { getThread, getThreadPageMetadata } from "@/lib/utils/thread-metadata";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  const thread = await getThread(params.id, "job-board");

  return getThreadPageMetadata(thread, locale, {
    title: t("MARKETPLACE.JOB_BOARD.META.TITLE"),
    description: t("MARKETPLACE.JOB_BOARD.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.JOB_BOARD.META.KEYWORDS"),
  });
}

export default async function JobBoardDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;

  return (
    <Suspense fallback={<ThreadDetailSkeleton />}>
      <BoardDetail threadId={params.id} boardType="job-board" />
    </Suspense>
  );
}
