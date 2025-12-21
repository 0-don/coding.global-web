"use client";

import { ThreadHeader } from "@/components/elements/thread-header";
import { ThreadReplies } from "@/components/elements/thread-replies";
import {
  useShowcaseThreadMessagesInfiniteQuery,
  useShowcaseThreadQuery,
} from "@/hook/bot-hook";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";

dayjs.extend(relativeTime);

interface ShowcaseDetailProps {
  threadId: string;
}

export function ShowcaseDetail({ threadId }: ShowcaseDetailProps) {
  const t = useTranslations();

  const showcaseThread = useShowcaseThreadQuery(threadId);
  const showcaseThreadMessages =
    useShowcaseThreadMessagesInfiniteQuery(threadId);

  const messages =
    showcaseThreadMessages.data?.pages.flatMap(
      (page) => page?.messages ?? [],
    ) ?? [];

  if (showcaseThread.isLoading || showcaseThreadMessages.isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("SHOWCASE.LOADING")}
        </p>
      </div>
    );
  }

  if (!showcaseThread.data) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("SHOWCASE.EMPTY.MESSAGES")}
        </p>
      </div>
    );
  }

  const thread = showcaseThread.data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 md:px-6">
      <ThreadHeader thread={thread} />
      <ThreadReplies
        messages={messages}
        parentThread={thread}
        hasNextPage={showcaseThreadMessages.hasNextPage}
        isFetchingNextPage={showcaseThreadMessages.isFetchingNextPage}
        fetchNextPage={showcaseThreadMessages.fetchNextPage}
      />
    </div>
  );
}
