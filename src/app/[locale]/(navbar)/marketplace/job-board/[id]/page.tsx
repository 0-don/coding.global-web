import { BoardDetail } from "@/components/pages/marketplace/board-detail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { JobJsonLd } from "@/components/seo/job-json-ld";
import { ThreadJsonLd } from "@/components/seo/thread-json-ld";
import { getThreadPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
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
    getThread(params.id, "job-board"),
  ]);
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
  const queryClient = getQueryClient();

  const [thread, messagesData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: queryKeys.thread("job-board", params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: "job-board" })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.fetchInfiniteQuery({
      queryKey: queryKeys.threadMessages("job-board", params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: "job-board" })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  const messages = messagesData?.pages?.[0]?.messages ?? [];
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/marketplace/job-board/${params.id}`;

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/${params.locale}` },
    { name: "Marketplace", url: `${baseUrl}/${params.locale}/marketplace` },
    { name: "Job Board", url: `${baseUrl}/${params.locale}/marketplace/job-board` },
    { name: thread?.name || "Job Listing" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {thread && (
        <>
          <ThreadJsonLd thread={thread} messages={messages} pageUrl={pageUrl} />
          <JobJsonLd
            data={{
              title: thread.name,
              description: thread.content || thread.name,
              datePosted: thread.createdAt || thread.updatedAt,
              employerName: thread.author.displayName || thread.author.username,
              pageUrl,
            }}
          />
        </>
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <BoardDetail threadId={params.id} threadType="job-board" />
      </HydrationBoundary>
    </>
  );
}
