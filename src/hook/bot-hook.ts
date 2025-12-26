import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import {
  getApiByGuildIdBoardByBoardType,
  GetApiByGuildIdBoardByBoardType200Item,
} from "@/openapi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useTeamQuery() {
  return useQuery({
    queryKey: queryKeys.team(),
    queryFn: async () => handleElysia(await rpc.api.bot.team.get()),
    enabled: false,
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news(),
    queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
    enabled: false,
  });
}

export function useDiscordWidget() {
  return useQuery({
    queryKey: queryKeys.discordWidget(),
    queryFn: async () => handleElysia(await rpc.api.bot.widget.get()),
    enabled: false,
  });
}

export function useShowcaseThreadsQuery() {
  return useQuery({
    queryKey: queryKeys.showcaseThreads(),
    // queryFn: async () => handleElysia(await rpc.api.bot.showcase.get()),
    queryFn: async () =>
      (
        await getApiByGuildIdBoardByBoardType(
          process.env.NEXT_PUBLIC_GUILD_ID!,
          "showcase",
        )
      ).data as GetApiByGuildIdBoardByBoardType200Item[],
    enabled: true,
  });
}

export function useShowcaseThreadQuery(threadId: string) {
  return useQuery({
    queryKey: queryKeys.showcaseThread(threadId),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.showcase({ threadId }).get()),
    enabled: false,
  });
}

export function useShowcaseThreadMessagesInfiniteQuery(threadId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.showcaseThreadMessages(threadId),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.bot.showcase({ threadId }).messages.get({
          query: { after: pageParam },
        }),
      ),

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });
}

// Job Board
export function useJobBoardThreadsQuery() {
  return useQuery({
    queryKey: queryKeys.jobBoardThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot["job-board"].get()),
    enabled: false,
  });
}

// Dev Board
export function useDevBoardThreadsQuery() {
  return useQuery({
    queryKey: queryKeys.devBoardThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot["dev-board"].get()),
    enabled: false,
  });
}

// Generic board hooks
export function useBoardThreadQuery(
  boardType: "job-board" | "dev-board",
  threadId: string,
) {
  return useQuery({
    queryKey: queryKeys.boardThread(boardType, threadId),
    queryFn: async () =>
      handleElysia(await rpc.api.bot[boardType]({ threadId }).get()),
    enabled: false,
  });
}

export function useBoardThreadMessagesInfiniteQuery(
  boardType: "job-board" | "dev-board",
  threadId: string,
) {
  return useInfiniteQuery({
    queryKey: queryKeys.boardThreadMessages(boardType, threadId),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.bot[boardType]({ threadId }).messages.get({
          query: { after: pageParam },
        }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
  });
}
