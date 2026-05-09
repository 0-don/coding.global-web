import { CodingLanguageDetail } from "@/components/pages/community/coding/coding-language-detail";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { ThreadJsonLd } from "@/components/seo/thread-json-ld";
import { getThreadPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { PROGRAMMING_LANGUAGES, ProgrammingThreadType } from "@/lib/types";
import { getThread } from "@/lib/utils/server";
import {
  getApiByGuildIdThreadByThreadTypeByThreadIdMessages,
} from "@/openapi";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Locale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

export const revalidate = 3600;

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
  const params = await props.params;
  const translationKey =
    params.language.toUpperCase() as Uppercase<ProgrammingThreadType>;
  const [t, thread] = await Promise.all([
    getTranslations({ locale: params.locale }),
    getThread(params.id, params.language),
  ]);

  return getThreadPageMetadata(
    thread,
    params.locale,
    {
      title: t(`CODING.${translationKey}.META.TITLE`),
      description: t(`CODING.${translationKey}.META.DESCRIPTION`),
      keywords: t(`CODING.${translationKey}.META.KEYWORDS`),
    },
    `/${params.locale}/community/coding/${params.language}/${params.id}`,
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

  const thread = await getThread(params.id, params.language);

  if (!thread) {
    notFound();
  }

  queryClient.setQueryData(queryKeys.thread(params.language, params.id), thread);

  const messagesData = await queryClient.fetchInfiniteQuery({
    queryKey: queryKeys.threadMessages(params.language, params.id),
    queryFn: async ({ pageParam }) => {
      const response = await getApiByGuildIdThreadByThreadTypeByThreadIdMessages(
        process.env.NEXT_PUBLIC_GUILD_ID!,
        params.language,
        params.id,
        { after: pageParam },
      );
      return response.status === 200
        ? response.data
        : { messages: [], hasMore: false, nextCursor: "" };
    },
    initialPageParam: undefined as string | undefined,
  });

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
