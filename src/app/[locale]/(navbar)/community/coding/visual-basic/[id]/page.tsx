import { CodingLanguageDetail } from "@/components/pages/community/coding/coding-language-detail";
import { LANGUAGE_CHANNELS } from "@/lib/config/language-channels";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { BoardType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { getThread, getThreadPageMetadata } from "@/lib/utils/thread-metadata";
import { GetApiByGuildIdBoardByBoardType200ItemBoardType as ApiBoardType } from "@/openapi";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

const CHANNEL = LANGUAGE_CHANNELS.find((c) => c.slug === "visual-basic")!;

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const [params, locale] = await Promise.all([props.params, serverLocale(props)]);
  const thread = await getThread(params.id, CHANNEL.boardType as ApiBoardType);

  return getThreadPageMetadata(thread, locale, {
    title: `${CHANNEL.displayName} - Coding Global`,
    description: `${CHANNEL.displayName} programming discussions`,
    keywords: `${CHANNEL.displayName}, programming, help, community`,
  });
}

export default async function VisualBasicDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThread(CHANNEL.boardType as BoardType, params.id),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot
            .board({ boardType: CHANNEL.boardType })({ threadId: params.id })
            .get(),
        ),
    }),
    queryClient.prefetchInfiniteQuery({
      queryKey: queryKeys.boardThreadMessages(
        CHANNEL.boardType as BoardType,
        params.id,
      ),
      queryFn: async ({ pageParam }) =>
        handleElysia(
          await rpc.api.bot
            .board({ boardType: CHANNEL.boardType })({ threadId: params.id })
            .messages.get({ query: { after: pageParam } }),
        ),
      initialPageParam: undefined as string | undefined,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CodingLanguageDetail channel={CHANNEL} threadId={params.id} />
    </HydrationBoundary>
  );
}
