import { CodingLanguageDetail } from "@/components/pages/community/coding/coding-language-detail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ThreadJsonLd } from "@/components/seo/thread-json-ld";
import { getThreadPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { PROGRAMMING_LANGUAGES, ProgrammingThreadType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getThread, serverLocale } from "@/lib/utils/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return PROGRAMMING_LANGUAGES.map((language) => ({
    language,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{
    locale: Locale;
    language: ProgrammingThreadType;
    id: string;
  }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const translationKey =
    params.language.toUpperCase() as Uppercase<ProgrammingThreadType>;
  const [t, thread] = await Promise.all([
    getTranslations({ locale }),
    getThread(params.id, params.language),
  ]);

  return getThreadPageMetadata(
    thread,
    locale,
    {
      title: t(`CODING.${translationKey}.META.TITLE`),
      description: t(`CODING.${translationKey}.META.DESCRIPTION`),
      keywords: t(`CODING.${translationKey}.META.KEYWORDS`),
    },
    `/${locale}/community/coding/${params.language}/${params.id}`,
  );
}

export default async function ProgrammingLanguageDetailPage(props: {
  params: Promise<{
    locale: string;
    language: ProgrammingThreadType;
    id: string;
  }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const [thread, messagesData] = await Promise.all([
    queryClient.fetchQuery({
      queryKey: queryKeys.thread(params.language, params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: params.language })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.fetchInfiniteQuery({
      queryKey: queryKeys.threadMessages(params.language, params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: params.language })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  const messages = messagesData?.pages?.[0]?.messages ?? [];
  const pageUrl = `${process.env.NEXT_PUBLIC_URL}/${params.locale}/community/coding/${params.language}/${params.id}`;

  const baseUrl = process.env.NEXT_PUBLIC_URL;
  const breadcrumbs = [
    { name: "Home", url: `${baseUrl}/${params.locale}` },
    { name: "Coding", url: `${baseUrl}/${params.locale}/community/coding` },
    {
      name: params.language,
      url: `${baseUrl}/${params.locale}/community/coding/${params.language}`,
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
        <CodingLanguageDetail
          threadType={params.language}
          threadId={params.id}
        />
      </HydrationBoundary>
    </>
  );
}
