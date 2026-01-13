"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import {
  useThreadMessagesInfiniteQuery,
  useThreadQuery,
} from "@/hook/bot-hook";
import { dayjs } from "@/lib/dayjs";

interface ShowcaseDetailProps {
  threadId: string;
}

export function ShowcaseDetail(props: ShowcaseDetailProps) {
  const boardThread = useThreadQuery("showcase", props.threadId);
  const boardThreadMessages = useThreadMessagesInfiniteQuery(
    "showcase",
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
