"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useShowcaseThreadMessagesInfiniteQuery,
  useShowcaseThreadQuery,
} from "@/hook/bot-hook";
import { Link } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { useVirtualizer } from "@tanstack/react-virtual";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Archive,
  Calendar,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

dayjs.extend(relativeTime);

interface ShowcaseDetailProps {
  threadId: string;
}

export function ShowcaseDetail({ threadId }: ShowcaseDetailProps) {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);

  const showcaseThread = useShowcaseThreadQuery(threadId);
  const showcaseThreadMessages =
    useShowcaseThreadMessagesInfiniteQuery(threadId);

  const messages =
    showcaseThreadMessages.data?.pages.flatMap(
      (page) => page?.messages ?? [],
    ) ?? [];

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= messages.length - 1 &&
      showcaseThreadMessages.hasNextPage &&
      !showcaseThreadMessages.isFetchingNextPage
    ) {
      showcaseThreadMessages.fetchNextPage();
    }
  }, [
    showcaseThreadMessages.hasNextPage,
    showcaseThreadMessages.fetchNextPage,
    messages.length,
    showcaseThreadMessages.isFetchingNextPage,
    virtualItems,
  ]);

  if (showcaseThread.isLoading || showcaseThreadMessages.isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 md:px-6">
        <p className="text-muted-foreground text-center">Loading...</p>
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
      {/* Original Post */}
      <div className="mb-6">
        <Card className="border-primary">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h1 className="mb-2 text-2xl font-bold">{thread.name}</h1>
                {thread.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <Badge key={tag.id}>
                        {tag.name} {tag.emoji.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {thread.archived && (
                  <Badge
                    variant="secondary"
                    className="gap-1"
                    title={
                      thread.archivedAt
                        ? dayjs(thread.archivedAt).format(
                            "MMMM D, YYYY [at] h:mm A",
                          )
                        : undefined
                    }
                  >
                    <Archive className="h-3 w-3" />
                    {thread.archivedAt
                      ? t("SHOWCASE.ARCHIVED_AT", {
                          date: dayjs(thread.archivedAt).fromNow(),
                        })
                      : t("SHOWCASE.ARCHIVED")}
                  </Badge>
                )}
                {thread.locked && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    {t("SHOWCASE.LOCKED")}
                  </Badge>
                )}
              </div>
            </div>

            {/* Thread Stats */}
            <div className="text-muted-foreground flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-1.5">
                <MessageCircle className="h-4 w-4" />
                <span>
                  {t("SHOWCASE.MESSAGES_COUNT", { count: thread.messageCount })}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>
                  {t("SHOWCASE.MEMBERS_COUNT", { count: thread.memberCount })}
                </span>
              </div>
              <div
                className="flex items-center gap-1.5"
                title={
                  thread.createdAt
                    ? dayjs(thread.createdAt).format("MMMM D, YYYY [at] h:mm A")
                    : undefined
                }
              >
                <Calendar className="h-4 w-4" />
                <span>{dayjs(thread.createdAt).fromNow()}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="flex gap-3">
              {thread.author && <DiscordUser user={thread.author} />}

              <div className="flex-1">
                {thread.content && (
                  <p className="mt-1 text-sm whitespace-pre-wrap">
                    <DiscordMarkdown content={thread.content} />
                  </p>
                )}

                {thread.imageUrl && (
                  <div className="mt-3">
                    <Image
                      src={thread.imageUrl}
                      alt={thread.name}
                      width={800}
                      height={600}
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Replies */}
      {messages.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">
            {t("SHOWCASE.REPLIES")} ({messages.length})
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
                const message = messages[virtualItem.index];
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
                              <div className="mb-2 flex items-center gap-2">
                                <span className="font-semibold">
                                  {message.author?.displayName ||
                                    message.author?.username}
                                </span>
                                <span className="text-muted-foreground text-xs">
                                  {dayjs(message.createdAt).fromNow()}
                                </span>
                              </div>

                              <p className="text-sm whitespace-pre-wrap">
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

            {showcaseThreadMessages.isFetchingNextPage && (
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
