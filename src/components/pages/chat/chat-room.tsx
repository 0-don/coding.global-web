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
import { useChatAddMutation, useChatsInfiniteQuery } from "@/hook/chat-hook";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import { HashIcon, Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useMemo, useRef, type KeyboardEvent } from "react";
import { FaDiscord } from "react-icons/fa";

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  createdAt: Date | null;
  user: {
    id: string;
    name: string;
    image: string | null;
    discordId: string | null;
    createdAt: Date;
    updatedAt: Date;
    emailVerified: boolean;
  } | null;
}

export function ChatRoom() {
  const t = useTranslations();
  const session = useSessionHook();
  const isLoggedIn = !!session?.data?.user.id;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const chatsQuery = useChatsInfiniteQuery();
  const chatAddMutation = useChatAddMutation();

  const allMessages = useMemo(() => {
    // Pages are newest-first, just flatten and dedupe
    const messages = (chatsQuery.data?.pages ?? []).flat() as ChatMessage[];
    const seen = new Set<string>();
    return messages.filter((msg) => {
      if (seen.has(msg.id)) return false;
      seen.add(msg.id);
      return true;
    });
  }, [chatsQuery.data]);

  const handleSendMessage = useCallback(() => {
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
  }, [chatAddMutation]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );


  const getItemKey = useCallback((item: ChatMessage) => item.id, []);

  const renderItem = useCallback(
    (renderProps: {
      item: ChatMessage;
      index: number;
      isFirstInGroup: boolean;
      previousItem: ChatMessage | null;
    }) => {
      return (
        <ChatEvent className="hover:bg-accent/50 py-2">
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
                  ? new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(renderProps.item.createdAt))
                  : ""}
              </ChatEventDescription>
            </div>
            <ChatEventContent>{renderProps.item.content}</ChatEventContent>
          </ChatEventBody>
        </ChatEvent>
      );
    },
    [t],
  );

  const renderLoader = useCallback(
    () => (
      <div className="flex items-center gap-2">
        <Loader2Icon className="size-4 animate-spin" />
        <span className="text-muted-foreground text-sm">
          {t("CHAT.LOADING_MESSAGES")}
        </span>
      </div>
    ),
    [t],
  );

  return (
    <Chat className="h-[calc(100vh-10rem)] rounded-lg border">
      <ChatHeader className="border-b">
        <ChatHeaderStart>
          <HashIcon className="text-muted-foreground size-5" />
          <span className="font-medium">{t("CHAT.GENERAL")}</span>
        </ChatHeaderStart>
      </ChatHeader>

      <ChatMessagesVirtual
        items={allMessages}
        getItemKey={getItemKey}
        hasNextPage={chatsQuery.hasNextPage}
        isFetchingNextPage={chatsQuery.isFetchingNextPage}
        fetchNextPage={chatsQuery.fetchNextPage}
        renderItem={renderItem}
        renderLoader={renderLoader}
        estimateSize={80}
        overscan={10}
        className="py-2"
      />

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
