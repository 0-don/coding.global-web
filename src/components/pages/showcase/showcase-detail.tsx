"use client";

import { ShowcaseMessageCard } from "@/components/pages/showcase/showcase-message-card";
import { useShowcaseThreadMessagesInfiniteQuery } from "@/hook/showcase-hook";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

interface ShowcaseDetailProps {
  threadId: string;
}

export function ShowcaseDetail({ threadId }: ShowcaseDetailProps) {
  const t = useTranslations();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useShowcaseThreadMessagesInfiniteQuery(threadId);

  const allMessages =
    data?.pages.flatMap((page) => (page ? page.messages : [])) ?? [];

  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: allMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Infinite scroll logic
  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= allMessages.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    allMessages.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">Loading...</p>
      </div>
    );
  }

  if (!allMessages || allMessages.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">
          {t("SHOWCASE.EMPTY.MESSAGES")}
        </p>
      </div>
    );
  }

  const [firstMessage, ...replies] = allMessages;

  return (
    <div className="container mx-auto px-4 py-6 md:px-6">
      {/* Original Post */}
      <div className="mb-6">
        <ShowcaseMessageCard message={firstMessage} isOriginalPost />
      </div>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t("SHOWCASE.REPLIES")} ({replies.length})
          </h2>

          <div ref={parentRef} className="h-[calc(100vh-400px)] overflow-auto">
            <div
              style={{
                height: `${virtualizer.getTotalSize()}px`,
                width: "100%",
                position: "relative",
              }}
            >
              {virtualizer.getVirtualItems().map((virtualItem) => {
                const message = replies[virtualItem.index];
                return (
                  <div
                    key={message.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      transform: `translateY(${virtualItem.start}px)`,
                    }}
                  >
                    <div className="pb-4">
                      <ShowcaseMessageCard message={message} />
                    </div>
                  </div>
                );
              })}
            </div>

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <p className="text-muted-foreground text-sm">
                  Loading more messages...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
