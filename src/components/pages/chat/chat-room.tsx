"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Chat } from "@/components/ui/chat/chat";
import {
  ChatEvent,
  ChatEventAddon,
  ChatEventBody,
  ChatEventContent,
  ChatEventDescription,
  ChatEventTitle,
} from "@/components/ui/chat/chat-event";
import { ChatHeader, ChatHeaderStart } from "@/components/ui/chat/chat-header";
import { ChatMessagesVirtual } from "@/components/ui/chat/chat-messages-virtual";
import {
  ChatToolbar,
  ChatToolbarSendButton,
  ChatToolbarTextarea,
} from "@/components/ui/chat/chat-toolbar";
import {
  useChatAddMutation,
  useChatDeleteMutation,
  useChatsInfiniteQuery,
} from "@/hook/chat-hook";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import dayjs from "dayjs";
import { HashIcon, Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, type KeyboardEvent } from "react";
import { FaDiscord } from "react-icons/fa";

export function ChatRoom() {
  const t = useTranslations();
  const session = useSessionHook();
  const isLoggedIn = !!session?.data?.user.id;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatsQuery = useChatsInfiniteQuery();
  const chatAddMutation = useChatAddMutation();
  const chatDeleteMutation = useChatDeleteMutation();

  const allMessages = (chatsQuery.data?.pages ?? []).reduceRight(
    (acc, page) => [...acc, ...page],
    [],
  );

  const handleSendMessage = () => {
    const content = textareaRef.current?.value.trim();
    if (!content) return;

    if (textareaRef.current) {
      textareaRef.current.value = "";
    }

    chatAddMutation.mutate(
      { content },
      {
        onSettled: () => {
          requestAnimationFrame(() => {
            textareaRef.current?.focus();
          });
        },
      },
    );
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = (messageId: number) => {
    chatDeleteMutation.mutate(messageId);
  };

  return (
    <Chat className="h-[calc(100vh-10rem)] rounded-lg border">
      <ChatHeader className="border-b">
        <ChatHeaderStart>
          <HashIcon className="text-muted-foreground size-5" />
          <span className="font-medium">{t("CHAT.GENERAL")}</span>
        </ChatHeaderStart>
      </ChatHeader>

      <ChatMessagesVirtual
        itemKey="id"
        items={allMessages}
        hasNextPage={chatsQuery.hasNextPage}
        isFetchingNextPage={chatsQuery.isFetchingNextPage}
        fetchNextPage={chatsQuery.fetchNextPage}
      >
        {(renderProps) => {
          const isOwnMessage =
            renderProps.item.userId === session?.data?.user.id;

          return (
            <ChatEvent className="group hover:bg-accent/50 py-2">
              <ChatEventAddon>
                <Avatar className="mx-auto size-8 @md/chat:size-10">
                  <AvatarImage
                    src={renderProps.item.user?.image ?? undefined}
                    alt={renderProps.item.user?.name}
                  />
                  <AvatarFallback>
                    {renderProps.item.user?.name?.slice(0, 2).toUpperCase() ??
                      "??"}
                  </AvatarFallback>
                </Avatar>
              </ChatEventAddon>
              <ChatEventBody>
                <div className="flex items-baseline gap-2">
                  <ChatEventTitle>
                    {renderProps.item.user?.name ?? t("CHAT.UNKNOWN_USER")}
                  </ChatEventTitle>
                  <ChatEventDescription>
                    {renderProps.item.createdAt
                      ? dayjs(renderProps.item.createdAt).format(
                          "DD.MM.YYYY HH:mm:ss",
                        )
                      : ""}
                    {" • "}
                    <span className="text-muted-foreground/50 font-mono text-xs">
                      {renderProps.item.id}
                    </span>
                  </ChatEventDescription>
                  {isOwnMessage && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:text-primary ml-auto size-6 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => handleDeleteMessage(renderProps.item.id)}
                      disabled={chatDeleteMutation.isPending}
                    >
                      <Trash2Icon className="size-3.5" />
                    </Button>
                  )}
                </div>
                <ChatEventContent>{renderProps.item.content}</ChatEventContent>
              </ChatEventBody>
            </ChatEvent>
          );
        }}
      </ChatMessagesVirtual>

      {isLoggedIn ? (
        <ChatToolbar>
          <ChatToolbarTextarea
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            disabled={chatAddMutation.isPending}
            placeholder={t("CHAT.TYPE_MESSAGE")}
          />
          <ChatToolbarSendButton
            onClick={handleSendMessage}
            disabled={chatAddMutation.isPending}
          />
        </ChatToolbar>
      ) : (
        <div className="bg-background sticky bottom-0 border-t p-3">
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              {t("CHAT.LOGIN_TO_SEND")}
            </p>
            <Button
              onClick={() =>
                authClient.signIn.social({
                  provider: "discord",
                  callbackURL: "/chat",
                })
              }
              size="sm"
              className="gap-2 bg-[#5865F2] text-white hover:bg-[#4752C4]"
            >
              <FaDiscord className="size-4" />
              <span>{t("MAIN.AUTH.LOGIN_WITH_DISCORD")}</span>
            </Button>
          </div>
        </div>
      )}
    </Chat>
  );
}
