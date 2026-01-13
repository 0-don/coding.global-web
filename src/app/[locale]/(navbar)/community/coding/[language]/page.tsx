import { CodingLanguage } from "@/components/pages/community/coding/coding-language";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { PROGRAMMING_LANGUAGES, ProgrammingThreadType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ThreadState, getThreadStoreKey } from "@/store/thread-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
  return PROGRAMMING_LANGUAGES.map((language) => ({
    language,
  }));
}

export async function generateMetadata(props: {
  params: Promise<{ locale: string; language: ProgrammingThreadType }>;
}) {
  const params = await props.params;
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  const translationKey =
    params.language.toUpperCase() as Uppercase<ProgrammingThreadType>;

  return getPageMetadata({
    locale,
    title: t(`CODING.${translationKey}.META.TITLE`),
    description: t(`CODING.${translationKey}.META.DESCRIPTION`),
    keywords: t(`CODING.${translationKey}.META.KEYWORDS`),
  });
}

export default async function ProgrammingLanguagePage(props: {
  params: Promise<{ language: ProgrammingThreadType }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads(params.language),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot.thread({ threadType: params.language }).get(),
        ),
    }),
    getCookieValue<ThreadState>(getThreadStoreKey(params.language)),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ThreadStoreProvider threadType={params.language} data={listItemStore}>
        <CodingLanguage threadType={params.language} />
      </ThreadStoreProvider>
    </HydrationBoundary>
  );
}
