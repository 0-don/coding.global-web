import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { useQuery } from "@tanstack/react-query";

export function useShowcaseThreadsQuery() {
  return useQuery({
    queryKey: queryKeys.showcaseThreads(),
    queryFn: async () => handleElysia(await rpc.api.bot.showcase.get()),
    enabled: false,
  });
}

export function useShowcaseThreadMessagesQuery(threadId: string) {
  return useQuery({
    queryKey: queryKeys.showcaseThreadMessages(threadId),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.showcase({ threadId }).get()),
    enabled: false,
  });
}
