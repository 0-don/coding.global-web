/* eslint-disable react-hooks/incompatible-library */
// coding.global-web/src/components/pages/showcase/showcase-detail.tsx
"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Card, CardContent } from "@/components/ui/card";
import { useShowcaseThreadMessagesInfiniteQuery } from "@/hook/showcase-hook";
import { Link } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { useVirtualizer } from "@tanstack/react-virtual";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

dayjs.extend(relativeTime);

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

  const virtualizer = useVirtualizer({
    count: allMessages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

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
        <Card className="border-primary">
          <CardContent className="p-4">
            <div className="flex gap-3">
              {firstMessage.author && (
                <DiscordUser user={firstMessage.author} />
              )}

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  {firstMessage.author && (
                    <DiscordUser user={firstMessage.author} />
                  )}
                  <span className="text-muted-foreground text-xs">
                    {dayjs(firstMessage.createdAt).fromNow()}
                  </span>
                </div>

                <p className="mt-1 text-sm whitespace-pre-wrap">
                  <DiscordMarkdown content={firstMessage.content} />
                </p>

                {firstMessage.attachments &&
                  firstMessage.attachments.length > 0 && (
                    <div className="mt-2 grid gap-2">
                      {firstMessage.attachments.map((att) =>
                        att.contentType?.startsWith("image/") ? (
                          <Image
                            key={att.url}
                            src={att.url}
                            alt={att.name}
                            width={400}
                            height={300}
                            className="rounded"
                          />
                        ) : (
                          <Link
                            key={att.url}
                            href={att.url as LinkHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-500 hover:underline"
                          >
                            {att.name}
                          </Link>
                        ),
                      )}
                    </div>
                  )}

                {firstMessage.embeds && firstMessage.embeds.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {firstMessage.embeds.map((embed, idx) => (
                      <div
                        key={idx}
                        className="border-l-4 pl-3"
                        style={{
                          borderColor: `#${embed.color?.toString(16).padStart(6, "0")}`,
                        }}
                      >
                        {embed.title && (
                          <p className="font-semibold">{embed.title}</p>
                        )}
                        {embed.description && (
                          <p className="text-sm">{embed.description}</p>
                        )}
                        {embed.url && (
                          <Link
                            href={embed.url as LinkHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                          >
                            {embed.url}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
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
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex gap-3">
                            {message.author && (
                              <DiscordUser user={message.author} />
                            )}

                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                {message.author && (
                                  <DiscordUser user={message.author} />
                                )}
                                <span className="text-muted-foreground text-xs">
                                  {dayjs(message.createdAt).fromNow()}
                                </span>
                              </div>

                              <p className="mt-1 text-sm whitespace-pre-wrap">
                                <DiscordMarkdown content={message.content} />
                              </p>

                              {message.attachments &&
                                message.attachments.length > 0 && (
                                  <div className="mt-2 grid gap-2">
                                    {message.attachments.map((att) =>
                                      att.contentType?.startsWith("image/") ? (
                                        <Image
                                          key={att.url}
                                          src={att.url}
                                          alt={att.name}
                                          width={400}
                                          height={300}
                                          className="rounded"
                                        />
                                      ) : (
                                        <Link
                                          key={att.url}
                                          href={att.url as LinkHref}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-sm text-blue-500 hover:underline"
                                        >
                                          {att.name}
                                        </Link>
                                      ),
                                    )}
                                  </div>
                                )}

                              {message.embeds && message.embeds.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {message.embeds.map((embed, idx) => (
                                    <div
                                      key={idx}
                                      className="border-l-4 pl-3"
                                      style={{
                                        borderColor: `#${embed.color?.toString(16).padStart(6, "0")}`,
                                      }}
                                    >
                                      {embed.title && (
                                        <p className="font-semibold">
                                          {embed.title}
                                        </p>
                                      )}
                                      {embed.description && (
                                        <p className="text-sm">
                                          {embed.description}
                                        </p>
                                      )}
                                      {embed.url && (
                                        <Link
                                          href={embed.url as LinkHref}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs text-blue-500 hover:underline"
                                        >
                                          {embed.url}
                                        </Link>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
