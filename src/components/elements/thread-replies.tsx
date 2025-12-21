"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Link } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItem } from "@/openapi";
import { useVirtualizer } from "@tanstack/react-virtual";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useEffect, useRef } from "react";

interface ThreadRepliesProps {
  messages: GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItem[];
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function ThreadReplies({
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ThreadRepliesProps) {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: messages.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useEffect(() => {
    const lastItem = virtualItems[virtualItems.length - 1];

    if (!lastItem) return;

    if (
      lastItem.index >= messages.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    messages.length,
    isFetchingNextPage,
    virtualItems,
  ]);

  if (messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {t("SHOWCASE.REPLIES")} ({messages.length})
      </h2>

      <div
        ref={parentRef}
        className="bg-background/50 h-[calc(100vh-400px)] overflow-auto rounded-lg border"
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => {
            const message = messages[virtualItem.index];
            const prevMessage =
              virtualItem.index > 0 ? messages[virtualItem.index - 1] : null;
            const showAvatar =
              !prevMessage || prevMessage.author?.id !== message.author?.id;

            return (
              <div
                key={message.id}
                data-index={virtualItem.index}
                ref={virtualizer.measureElement}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  transform: `translateY(${virtualItem.start}px)`,
                }}
              >
                <div
                  className="hover:bg-accent/50 px-4 py-0.5 transition-colors"
                  style={{
                    marginTop: showAvatar ? "1rem" : "0",
                  }}
                >
                  <div className="flex gap-4">
                    {/* Avatar column */}
                    <div className="w-10 shrink-0">
                      {showAvatar && message.author && (
                        <DiscordUser user={message.author} />
                      )}
                    </div>

                    {/* Message content */}
                    <div className="min-w-0 flex-1">
                      {showAvatar && (
                        <div className="mb-1 flex items-baseline gap-2">
                          <span className="text-sm font-semibold">
                            {message.author?.displayName ||
                              message.author?.username}
                          </span>
                          <span className="text-muted-foreground text-xs">
                            {dayjs(message.createdAt).format(
                              "MM/DD/YYYY h:mm A",
                            )}
                          </span>
                        </div>
                      )}

                      <div className="text-sm wrap-break-word whitespace-pre-wrap">
                        <DiscordMarkdown content={message.content} />
                      </div>

                      {message.attachments &&
                        message.attachments.length > 0 && (
                          <div className="mt-2 grid gap-2">
                            {message.attachments.map((att) => (
                              <Link
                                key={att.url}
                                href={att.url as LinkHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={
                                  att.contentType?.startsWith("image/")
                                    ? "inline-block cursor-pointer"
                                    : "text-primary hover:text-primary/80 text-sm hover:underline"
                                }
                              >
                                {att.contentType?.startsWith("image/") ? (
                                  <Image
                                    src={att.url}
                                    alt={att.name}
                                    width={400}
                                    height={300}
                                    className="max-w-md rounded"
                                  />
                                ) : (
                                  att.name
                                )}
                              </Link>
                            ))}
                          </div>
                        )}

                      {message.embeds && message.embeds.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.embeds.map((embed, idx) => (
                            <div
                              key={idx}
                              className="bg-accent/30 max-w-lg rounded border-l-4 py-2 pl-3"
                              style={{
                                borderColor: `#${embed.color?.toString(16).padStart(6, "0")}`,
                              }}
                            >
                              {embed.title && (
                                <p className="mb-1 text-sm font-semibold">
                                  {embed.title}
                                </p>
                              )}
                              {embed.description && (
                                <p className="text-muted-foreground text-sm">
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
                </div>
              </div>
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <p className="text-muted-foreground text-sm">
              {t("SHOWCASE.LOADING_MORE_MESSAGES")}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
