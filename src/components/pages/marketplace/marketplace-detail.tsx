"use client";

import { ThreadHeader } from "@/components/elements/thread/thread-header";
import { ThreadReplies } from "@/components/elements/thread/thread-replies";
import {
  useBoardThreadMessagesInfiniteQuery,
  useBoardThreadQuery,
} from "@/hook/bot-hook";
import { MarketplaceBoardType } from "@/lib/types";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

interface MarketplaceDetailProps {
  threadId: string;
  boardType: MarketplaceBoardType | null;
}

export function MarketplaceDetail(props: MarketplaceDetailProps) {
  const t = useTranslations();

  const boardThread = useBoardThreadQuery(
    props.boardType ?? "job-board",
    props.threadId,
  );
  const boardThreadMessages = useBoardThreadMessagesInfiniteQuery(
    props.boardType ?? "job-board",
    props.threadId,
  );

  const messages =
    boardThreadMessages.data?.pages.flatMap((page) => page?.messages ?? []) ??
    [];

  if (!props.boardType) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("MARKETPLACE.EMPTY.MESSAGES")}
        </p>
      </div>
    );
  }

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
