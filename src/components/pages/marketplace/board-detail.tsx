"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import {
  useBoardThreadQuery,
  useBoardThreadMessagesInfiniteQuery,
} from "@/hook/bot-hook";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

interface BoardDetailProps {
  threadId: string;
  boardType: "job-board" | "dev-board";
}

export function BoardDetail({ threadId, boardType }: BoardDetailProps) {
  const t = useTranslations();

  const boardThread = useBoardThreadQuery(boardType, threadId);
  const boardThreadMessages = useBoardThreadMessagesInfiniteQuery(
    boardType,
    threadId,
  );

  const messages =
    boardThreadMessages.data?.pages.flatMap((page) => page?.messages ?? []) ??
    [];

  if (boardThread.isLoading || boardThreadMessages.isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("MARKETPLACE.LOADING")}
        </p>
      </div>
    );
  }

  if (!boardThread.data) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("MARKETPLACE.EMPTY.MESSAGES")}
        </p>
      </div>
    );
  }

  const thread = boardThread.data;

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
