"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import {
  useThreadMessagesInfiniteQuery,
  useThreadQuery,
} from "@/hook/bot-hook";
import { MarketplaceThreadType } from "@/lib/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface MarketplaceDetailProps {
  threadId: string;
  threadType: MarketplaceThreadType;
}

export function MarketplaceDetail(props: MarketplaceDetailProps) {
  const boardThread = useThreadQuery(props.threadType, props.threadId);
  const boardThreadMessages = useThreadMessagesInfiniteQuery(
    props.threadType,
    props.threadId,
  );

  const thread = boardThread.data;
  const messages =
    boardThreadMessages.data?.pages.flatMap((page) => page?.messages ?? []) ??
    [];

  if (!thread) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <ThreadHeader thread={thread} />
      <ThreadReplies
        messages={messages}
        parentThread={thread}
        hasNextPage={boardThreadMessages.hasNextPage}
        isFetchingNextPage={boardThreadMessages.isFetchingNextPage}
        fetchNextPage={boardThreadMessages.fetchNextPage}
      />
    </div>
  );
}
