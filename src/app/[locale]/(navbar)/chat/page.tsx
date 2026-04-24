import { ChatRoom } from "@/components/pages/chat/chat-room";
import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("CHAT.META.TITLE"),
    description: t("CHAT.META.DESCRIPTION"),
    keywords: t("CHAT.META.KEYWORDS"),
    href: "/chat",
  });
}

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
