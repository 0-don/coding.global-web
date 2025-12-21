import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { GetApiByGuildIdBoardByBoardTypeByThreadId200 } from "@/openapi";
import dayjs from "dayjs";
import { Archive, Calendar, Lock, MessageCircle, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ThreadHeaderProps {
  thread: GetApiByGuildIdBoardByBoardTypeByThreadId200;
}

export function ThreadHeader({ thread }: ThreadHeaderProps) {
  const t = useTranslations();

  return (
    <div className="mb-6">
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold">{thread.name}</h1>
              {thread.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {thread.tags.map((tag) => (
                    <Badge key={tag.id}>
                      {tag.name} {tag.emoji.name ?? ""}
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
          <div className="items-start gap-3">
            {thread.author && <DiscordUser user={thread.author} />}

            <div className="flex-1">
              {thread.content && (
                <p className="text-sm whitespace-pre-wrap">
                  <DiscordMarkdown content={thread.content} />
                </p>
              )}

              {thread.imageUrl && (
                <Image
                  src={thread.imageUrl}
                  alt={thread.name}
                  width={800}
                  height={600}
                  className="rounded-lg"
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
