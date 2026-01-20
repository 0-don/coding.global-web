import { ShowcaseDetail } from "@/components/pages/community/showcase/showcase-detail";
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
    getThread(params.id, "showcase"),
  ]);
  return getThreadPageMetadata(thread, locale, {
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
  });
}

export default async function ShowcaseDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const [thread, messagesData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: queryKeys.thread("showcase", params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: "showcase" })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.fetchInfiniteQuery({
      queryKey: queryKeys.threadMessages("showcase", params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: "showcase" })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  const messages = messagesData?.pages?.[0]?.messages ?? [];
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/community/showcase/${params.id}`;

  return (
    <>
      {thread && (
        <ThreadJsonLd thread={thread} messages={messages} pageUrl={pageUrl} />
      )}
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ShowcaseDetail threadId={params.id} />
      </HydrationBoundary>
    </>
  );
}
