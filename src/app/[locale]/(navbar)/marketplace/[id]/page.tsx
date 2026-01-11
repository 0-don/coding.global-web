import { MarketplaceDetail } from "@/components/pages/marketplace/marketplace-detail";
import { getPageMetadata, getThreadPageMetadata } from "@/lib/config/metadata";
import { rpc } from "@/lib/rpc";
import { MarketplaceBoardType } from "@/lib/types";
import { serverLocale } from "@/lib/utils/server";
import { GetApiByGuildIdBoardByBoardTypeByThreadId200 } from "@/openapi";
import { getTranslations } from "next-intl/server";

type ThreadWithType = {
  thread: GetApiByGuildIdBoardByBoardTypeByThreadId200;
  boardType: MarketplaceBoardType;
} | null;

function detectThread(threadId: string): Promise<ThreadWithType>[] {
  return [
    rpc.api.bot
      .board({ boardType: "job-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, boardType: "job-board" as const }
          : null,
      )
      .catch(() => null),
    rpc.api.bot
      .board({ boardType: "dev-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, boardType: "dev-board" as const }
          : null,
      )
      .catch(() => null),
  ];
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const [t, jobBoardResult, devBoardResult] = await Promise.all([
    getTranslations({ locale }),
    ...detectThread(params.id),
  ]);

  const result = jobBoardResult ?? devBoardResult;

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

export default async function MarketplaceDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const results = await Promise.all(detectThread(params.id));
  const result = results.find((r) => r !== null);

  if (!result) {
    return null;
  }

  return (
    <MarketplaceDetail threadId={params.id} boardType={result.boardType} />
  );
}
