import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { BoardType } from "@/lib/types";
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

export function useBoardThreadsQuery(boardType: BoardType) {
  return useQuery({
    queryKey: queryKeys.boardThreads(boardType),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.board({ boardType }).get()),
  });
}

export function useBoardThreadQuery(boardType: BoardType, threadId: string) {
  return useQuery({
    queryKey: queryKeys.boardThread(boardType, threadId),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.board({ boardType })({ threadId }).get()),
  });
}

export function useBoardThreadMessagesInfiniteQuery(
  boardType: BoardType,
  threadId: string,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.boardThreadMessages(boardType, threadId),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.bot
          .board({ boardType })({ threadId })
          .messages.get({ query: { after: pageParam } }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });
}
