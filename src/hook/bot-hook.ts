import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import {
  useInfiniteQuery,
  useQuery,
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

export function useShowcaseThreadsQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.showcaseThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot.showcase.get()),
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
  return useSuspenseQuery({
    queryKey: queryKeys.jobBoardThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot["job-board"].get()),
  });
}

// Dev Board
export function useDevBoardThreadsQuery() {
  return useSuspenseQuery({
    queryKey: queryKeys.devBoardThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot["dev-board"].get()),
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
