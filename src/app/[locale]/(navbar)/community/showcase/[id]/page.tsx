import { ShowcaseDetail } from "@/components/pages/community/showcase/showcase-detail";
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
    getThread(params.id, "showcase"),
  ]);
  return getThreadPageMetadata(
    thread,
    locale,
    {
      title: t("SHOWCASE.META.TITLE"),
      description: t("SHOWCASE.META.DESCRIPTION"),
      keywords: t("SHOWCASE.META.KEYWORDS"),
    },
    `/${locale}/community/showcase/${params.id}`,
  );
}

export default async function ShowcaseDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const threadResponse = await rpc.api.bot
    .thread({ threadType: "showcase" })({ threadId: params.id })
    .get();

  const thread = threadResponse.status === 200 ? threadResponse.data : null;

  if (thread) {
    queryClient.setQueryData(queryKeys.thread("showcase", params.id), thread);
  }

  const messagesData = await queryClient.fetchInfiniteQuery({
    queryKey: queryKeys.threadMessages("showcase", params.id),
    queryFn: async ({ pageParam }) => {
      const response = await rpc.api.bot
        .thread({ threadType: "showcase" })({ threadId: params.id })
        .messages.get({ query: { after: pageParam } });
      return response.status === 200 ? response.data : { messages: [], hasMore: false, nextCursor: "" };
    },
    initialPageParam: undefined as string | undefined,
  });

  const messages = messagesData?.pages?.[0]?.messages ?? [];
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/community/showcase/${params.id}`;

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/${params.locale}` },
    { name: "Showcase", url: `${baseUrl}/${params.locale}/community/showcase` },
    { name: thread?.name || "Thread" },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbs} />
      {thread && (
        <ThreadJsonLd thread={thread} messages={messages} pageUrl={pageUrl} />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShowcaseDetail threadId={params.id} />
      </HydrationBoundary>
    </>
  );
}
