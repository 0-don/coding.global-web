"use client";

import type { GetApiByGuildIdBoardByBoardTypeByThreadId200MessagesItem } from "@/openapi";
import { DiscordUserPopover } from "@/components/elements/discord/discord-user-popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

interface ShowcaseMessageCardProps {
  message: GetApiByGuildIdBoardByBoardTypeByThreadId200MessagesItem;
  isOriginalPost?: boolean;
}

export function ShowcaseMessageCard({
  message,
  isOriginalPost,
}: ShowcaseMessageCardProps) {
  return (
    <Card className={isOriginalPost ? "border-primary" : ""}>
      <CardContent className="p-4">
        <div className="flex gap-3">
          {message.author && (
            <DiscordUserPopover user={message.author}>
              <Avatar className="h-10 w-10 cursor-pointer">
                <AvatarImage src={message.author.displayAvatarURL} />
                <AvatarFallback>
                  {message.author.displayName?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DiscordUserPopover>
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              {message.author && (
                <DiscordUserPopover user={message.author}>
                  <span className="cursor-pointer font-semibold hover:underline">
                    {message.author.displayName}
                  </span>
                </DiscordUserPopover>
              )}
              <span className="text-muted-foreground text-xs">
                {dayjs(message.createdAt).fromNow()}
              </span>
            </div>

            <p className="mt-1 text-sm whitespace-pre-wrap">
              {message.content}
            </p>

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
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
                    <a
                      key={att.url}
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
                    >
                      {att.name}
                    </a>
                  ),
                )}
              </div>
            )}

            {/* Embeds */}
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
                      <p className="font-semibold">{embed.title}</p>
                    )}
                    {embed.description && (
                      <p className="text-sm">{embed.description}</p>
                    )}
                    {embed.url && (
                      <a
                        href={embed.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {embed.url}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
