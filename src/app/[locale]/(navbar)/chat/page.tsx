import { ChatRoom } from "@/components/pages/chat/chat-room";
import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function ChatPage() {
  const queryClient = getQueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.chats(),
    queryFn: async ({ pageParam }) => {
      const response = await rpc.api.chat.get({
        query: { cursor: pageParam, limit: PAGEABLE_LIMIT },
      });
      if (response.error) throw response.error;
      return response.data || [];
    },
    initialPageParam: null as string | undefined | null,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container mx-auto px-4 py-6">
        <ChatRoom />
      </div>
    </HydrationBoundary>
  );
}
