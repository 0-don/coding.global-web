import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { ThreadType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useTeamQuery() {
  return useQuery({
    queryKey: queryKeys.team(),
    queryFn: async () => handleElysia(await rpc.api.bot.team.get()),
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news(),
    queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
  });
}

export function useDiscordWidget() {
  return useQuery({
    queryKey: queryKeys.discordWidget(),
    queryFn: async () => handleElysia(await rpc.api.bot.widget.get()),
  });
}

export function useTopStatsQuery() {
  return useQuery({
    queryKey: queryKeys.top(),
    queryFn: async () => handleElysia(await rpc.api.bot.top.get()),
  });
}

export function useThreadsQuery(threadType: ThreadType) {
  return useQuery({
    queryKey: queryKeys.threads(threadType),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.thread({ threadType }).get()),
  });
}

export function useThreadQuery(threadType: ThreadType, threadId: string) {
  return useQuery({
    queryKey: queryKeys.thread(threadType, threadId),
    queryFn: async () =>
      handleElysia(
        await rpc.api.bot.thread({ threadType })({ threadId }).get(),
      ),
  });
}

export function useThreadMessagesInfiniteQuery(
  threadType: ThreadType,
  threadId: string,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.threadMessages(threadType, threadId),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.bot
          .thread({ threadType })({ threadId })
          .messages.get({ query: { after: pageParam } }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });
}
