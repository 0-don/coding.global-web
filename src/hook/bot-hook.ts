import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { BoardType } from "@/lib/types";
import { handleElysia } from "@/lib/utils/base";
import {
  useSuspenseInfiniteQuery,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useTeamQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.team(),
    queryFn: async () => handleElysia(await rpc.api.bot.team.get()),
  });
}

export function useNewsQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.news(),
    queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
  });
}

export function useDiscordWidget() {
  return useSuspenseQuery({
    queryKey: queryKeys.discordWidget(),
    queryFn: async () => handleElysia(await rpc.api.bot.widget.get()),
  });
}

export function useBoardThreadsQuery(boardType: BoardType) {
  return useSuspenseQuery({
    queryKey: queryKeys.boardThreads(boardType),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.board({ boardType }).get()),
  });
}

export function useBoardThreadQuery(boardType: BoardType, threadId: string) {
  return useSuspenseQuery({
    queryKey: queryKeys.boardThread(boardType, threadId),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.board({ boardType })({ threadId }).get()),
  });
}

export function useBoardThreadMessagesInfiniteQuery(
  boardType: BoardType,
  threadId: string,
) {
  return useSuspenseInfiniteQuery({
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
