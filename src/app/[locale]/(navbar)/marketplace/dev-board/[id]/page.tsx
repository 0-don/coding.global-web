import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ThreadJsonLd } from "@/components/seo/thread-json-ld";
import { getThreadPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { getThread, serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const [t, thread] = await Promise.all([
    getTranslations({ locale }),
    getThread(params.id, "dev-board"),
  ]);
  return getThreadPageMetadata(
    thread,
    locale,
    {
      title: t("MARKETPLACE.DEV_BOARD.META.TITLE"),
      description: t("MARKETPLACE.DEV_BOARD.META.DESCRIPTION"),
      keywords: t("MARKETPLACE.DEV_BOARD.META.KEYWORDS"),
    },
    `/${locale}/marketplace/dev-board/${params.id}`,
  );
}

export default async function DevBoardDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const threadResponse = await rpc.api.bot
    .thread({ threadType: "dev-board" })({ threadId: params.id })
    .get();

  const thread = threadResponse.status === 200 ? threadResponse.data : null;

  if (thread) {
    queryClient.setQueryData(queryKeys.thread("dev-board", params.id), thread);
  }

  const messagesData = await queryClient.fetchInfiniteQuery({
    queryKey: queryKeys.threadMessages("dev-board", params.id),
    queryFn: async ({ pageParam }) => {
      const response = await rpc.api.bot
        .thread({ threadType: "dev-board" })({ threadId: params.id })
        .messages.get({ query: { after: pageParam } });
      return response.status === 200 ? response.data : { messages: [], hasMore: false, nextCursor: "" };
    },
    initialPageParam: undefined as string | undefined,
  });

  const messages = messagesData?.pages?.[0]?.messages ?? [];
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/marketplace/dev-board/${params.id}`;

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/${params.locale}` },
    { name: "Marketplace", url: `${baseUrl}/${params.locale}/marketplace` },
    {
      name: "Dev Board",
      url: `${baseUrl}/${params.locale}/marketplace/dev-board`,
    },
    { name: thread?.name || "Thread" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {thread && (
        <ThreadJsonLd thread={thread} messages={messages} pageUrl={pageUrl} />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BoardDetail threadId={params.id} threadType="dev-board" />
      </HydrationBoundary>
    </>
  );
}
