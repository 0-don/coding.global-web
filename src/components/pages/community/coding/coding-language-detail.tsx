"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import {
  useBoardThreadMessagesInfiniteQuery,
  useBoardThreadQuery,
} from "@/hook/bot-hook";
import { LanguageChannel } from "@/lib/config/language-channels";
import { BoardType } from "@/lib/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface CodingLanguageDetailProps {
  channel: LanguageChannel;
  threadId: string;
}

export function CodingLanguageDetail(props: CodingLanguageDetailProps) {
  const boardThread = useBoardThreadQuery(
    props.channel.boardType as BoardType,
    props.threadId,
  );
  const boardThreadMessages = useBoardThreadMessagesInfiniteQuery(
    props.channel.boardType as BoardType,
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
