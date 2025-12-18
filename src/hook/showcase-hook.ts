import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export function useShowcaseThreadsQuery() {
  return useQuery({
    queryKey: queryKeys.showcaseThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot.showcase.get()),
    enabled: false,
  });
}

export function useShowcaseThreadMessagesInfiniteQuery(threadId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.showcaseThreadMessages(threadId),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.bot.showcase({ threadId }).get({
          query: { before: pageParam },
        }),
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      if (!lastPage) return undefined;
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    enabled: false,
  });
}
