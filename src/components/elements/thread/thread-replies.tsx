"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { MessageReactions } from "@/components/elements/discord/message-reactions";
import { MessageReplyReference } from "@/components/elements/discord/message-reply-reference";
import { Link } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import {
  GetApiByGuildIdBoardByBoardTypeByThreadId200,
  GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItem,
} from "@/openapi";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useMemo, useRef, useState } from "react";
import { Virtualizer, type VirtualizerHandle } from "virtua";

interface ThreadRepliesProps {
  messages: GetApiByGuildIdBoardByBoardTypeByThreadIdMessages200MessagesItem[];
  parentThread: GetApiByGuildIdBoardByBoardTypeByThreadId200;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export function ThreadReplies(props: ThreadRepliesProps) {
  const t = useTranslations();
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef<VirtualizerHandle>(null);
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | null
  >(null);

  // Create message lookup map for O(1) reference resolution
  const messageMap = useMemo(() => {
    const map = new Map();

    // Add parent thread to the map
    map.set(props.parentThread.id, {
      id: props.parentThread.id,
      author: props.parentThread.author,
      content: props.parentThread.content,
      createdAt: props.parentThread.createdAt,
      isParentThread: true,
    });

    // Add all reply messages to the map
    props.messages.forEach((msg) => {
      map.set(msg.id, {
        id: msg.id,
        author: msg.author,
        content: msg.content,
        createdAt: msg.createdAt,
        isParentThread: false,
      });
    });

    return map;
  }, [props.messages, props.parentThread]);

  const handleClickReference = (messageId: string, isParentThread: boolean) => {
    if (isParentThread) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const messageIndex = props.messages.findIndex(
        (msg) => msg.id === messageId,
      );
      if (messageIndex !== -1) {
        virtualRef.current?.scrollToIndex(messageIndex, { align: "start" });
        setHighlightedMessageId(messageId);
        setTimeout(() => {
          setHighlightedMessageId(null);
        }, 2000);
      }
    }
  };

  const handleScroll = (offset: number) => {
    if (!virtualRef.current) return;

    const distanceFromBottom =
      virtualRef.current.scrollSize -
      (offset + virtualRef.current.viewportSize);

    // Fetch more when near bottom
    if (
      distanceFromBottom < 200 &&
      props.hasNextPage &&
      !props.isFetchingNextPage
    ) {
      props.fetchNextPage();
    }
  };

  if (props.messages.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">
        {t("SHOWCASE.REPLIES")} ({props.messages.length})
      </h2>

      <div
        ref={parentRef}
        className="bg-background/50 h-[calc(100vh-400px)] overflow-auto rounded-lg border"
      >
        <Virtualizer
          ref={virtualRef}
          scrollRef={parentRef}
          onScroll={handleScroll}
        >
          {props.messages.map((message, index) => {
            const prevMessage = index > 0 ? props.messages[index - 1] : null;
            const showAvatar =
              !prevMessage || prevMessage.author?.id !== message.author?.id;

            return (
              <div key={message.id}>
                <div
                  className={`px-4 py-0.5 transition-all duration-300 ${
                    highlightedMessageId === message.id
                      ? "bg-primary/20 ring-primary/50 shadow-lg ring-2"
                      : "hover:bg-accent/50"
                  }`}
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

                      {/* Reply reference */}
                      {message.reference && (
                        <MessageReplyReference
                          reference={message.reference}
                          referencedMessage={messageMap.get(
                            message.reference.messageId || "",
                          )}
                          onClickReference={handleClickReference}
                        />
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
                                    unoptimized={att.url.includes(".gif")}
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

                      {/* Reactions */}
                      {message.reactions && message.reactions.length > 0 && (
                        <MessageReactions reactions={message.reactions} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </Virtualizer>

        {props.isFetchingNextPage && (
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
