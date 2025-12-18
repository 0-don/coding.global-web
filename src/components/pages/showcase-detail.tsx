"use client";

import { useShowcaseThreadMessagesQuery } from "@/hook/showcase-hook";
import { ShowcaseMessageCard } from "@/components/elements/showcase/showcase-message-card";
import { useTranslations } from "next-intl";

interface ShowcaseDetailProps {
  threadId: string;
}

export function ShowcaseDetail({ threadId }: ShowcaseDetailProps) {
  const t = useTranslations();
  const { data: messages } = useShowcaseThreadMessagesQuery(threadId);

  if (!messages || messages.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-6">
        <p className="text-center text-muted-foreground">
          {t("SHOWCASE.EMPTY.MESSAGES")}
        </p>
      </div>
    );
  }

  const [firstMessage, ...replies] = messages;

  return (
    <div className="container mx-auto px-4 md:px-6 py-6">
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
          {replies.map((message) => (
            <ShowcaseMessageCard key={message.id} message={message} />
          ))}
        </div>
      )}
    </div>
  );
}
