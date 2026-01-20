import { MarketplaceDetail } from "@/components/pages/marketplace/marketplace-detail";
import { ThreadJsonLd } from "@/components/seo/thread-json-ld";
import { getPageMetadata, getThreadPageMetadata } from "@/lib/config/metadata";
import { rpc } from "@/lib/rpc";
import { MarketplaceThreadType } from "@/lib/types";
import { serverLocale } from "@/lib/utils/server";
import {
  GetApiByGuildIdThreadByThreadTypeByThreadId200,
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem,
} from "@/openapi";
import { getTranslations } from "next-intl/server";

type ThreadWithType = {
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200;
  threadType: MarketplaceThreadType;
} | null;

function detectThread(threadId: string): Promise<ThreadWithType>[] {
  return [
    rpc.api.bot
      .thread({ threadType: "job-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, threadType: "job-board" as const }
          : null,
      )
      .catch(() => null) as Promise<ThreadWithType>,
    rpc.api.bot
      .thread({ threadType: "dev-board" })({ threadId })
      .get()
      .then((r) =>
        r.status === 200 && r.data
          ? { thread: r.data, threadType: "dev-board" as const }
          : null,
      )
      .catch(() => null) as Promise<ThreadWithType>,
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
    const { thread, threadType } = result;
    const fallback =
      threadType === "job-board"
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

async function fetchMessages(
  threadType: MarketplaceThreadType,
  threadId: string,
): Promise<
  GetApiByGuildIdThreadByThreadTypeByThreadIdMessages200MessagesItem[]
> {
  const response = await rpc.api.bot
    .thread({ threadType })({ threadId })
    .messages.get({ query: {} });
  if (response.status === 200 && response.data) {
    return response.data.messages ?? [];
  }
  return [];
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

  const messages = await fetchMessages(result.threadType, params.id);
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/marketplace/${params.id}`;

  return (
    <>
      <ThreadJsonLd
        thread={result.thread}
        messages={messages}
        pageUrl={pageUrl}
      />
      <MarketplaceDetail threadId={params.id} threadType={result.threadType} />
    </>
  );
}
