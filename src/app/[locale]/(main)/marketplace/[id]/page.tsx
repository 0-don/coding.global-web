import { ThreadDetailSkeleton } from "@/components/elements/thread/thread-detail-skeleton";
import { MarketplaceDetail } from "@/components/pages/marketplace/marketplace-detail";
import { getPageMetadata } from "@/lib/config/metadata";
import { rpc } from "@/lib/rpc";
import { MarketplaceBoardType } from "@/lib/types";
import { serverLocale } from "@/lib/utils/server";
import {
  detectThreadWithType,
  getThreadPageMetadata,
} from "@/lib/utils/thread-metadata";
import { GetApiByGuildIdBoardByBoardType200ItemBoardType as BoardType } from "@/openapi";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const [t, result] = await Promise.all([
    getTranslations({ locale }),
    detectThreadWithType(params.id),
  ]);

  if (result?.thread) {
    const { thread, boardType } = result;
    const fallback =
      boardType === "job-board"
        ? {
            title: t("MARKETPLACE.JOB_BOARD.META.TITLE"),
            description: t("MARKETPLACE.JOB_BOARD.META.DESCRIPTION"),
            keywords: t("MARKETPLACE.JOB_BOARD.META.KEYWORDS"),
          }
        : {
            title: t("MARKETPLACE.DEV_BOARD.META.TITLE"),
            description: t("MARKETPLACE.DEV_BOARD.META.DESCRIPTION"),
            keywords: t("MARKETPLACE.DEV_BOARD.META.KEYWORDS"),
          };

    return getThreadPageMetadata(thread, locale, fallback);
  }

  return getPageMetadata({
    locale,
    title: t("MARKETPLACE.META.TITLE"),
    description: t("MARKETPLACE.META.DESCRIPTION"),
    keywords: t("MARKETPLACE.META.KEYWORDS"),
  });
}

async function detectBoardType(
  threadId: string,
): Promise<MarketplaceBoardType | null> {
  const results = await Promise.all([
    rpc.api.bot
      .board({ boardType: "job-board" })({ threadId })
      .get()
      .then((r) => (r.status === 200 ? BoardType["job-board"] : null))
      .catch(() => null),
    rpc.api.bot
      .board({ boardType: "dev-board" })({ threadId })
      .get()
      .then((r) => (r.status === 200 ? BoardType["dev-board"] : null))
      .catch(() => null),
  ]);

  return results.find((r) => r !== null) || null;
}

export default async function MarketplaceDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const boardType = await detectBoardType(params.id);

  if (!boardType) {
    return null;
  }

  return (
    <>
      {/* <Suspense fallback={<ThreadDetailSkeleton />}> */}
      <MarketplaceDetail threadId={params.id} boardType={boardType} />
      {/* </Suspense> */}
    </>
  );
}
