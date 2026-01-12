import { CodingLanguageDetail } from "@/components/pages/community/coding/coding-language-detail";
import { getThreadPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { ProgrammingThreadType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { getThread, serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

const BOARD_TYPE: ProgrammingThreadType = "bash-powershell";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([
    props.params,
    serverLocale(props),
  ]);
  const [t, thread] = await Promise.all([
    getTranslations({ locale }),
    getThread(params.id, BOARD_TYPE),
  ]);

  return getThreadPageMetadata(thread, locale, {
    title: t("CODING.BASH_POWERSHELL.META.TITLE"),
    description: t("CODING.BASH_POWERSHELL.META.DESCRIPTION"),
    keywords: t("CODING.BASH_POWERSHELL.META.KEYWORDS"),
  });
}

export default async function BashPowershellDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.thread(BOARD_TYPE, params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: BOARD_TYPE })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.threadMessages(BOARD_TYPE, params.id),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .thread({ threadType: BOARD_TYPE })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CodingLanguageDetail threadType={BOARD_TYPE} threadId={params.id} />
    </HydrationBoundary>
  );
}
