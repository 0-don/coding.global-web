import { DiscordMarkdown } from "@/components/ui/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getDiscordChannelLink } from "@/lib/utils/base";
import { GetApiByGuildIdThreadByThreadTypeByThreadId200 } from "@/openapi";
import dayjs from "dayjs";
import {
  Archive,
  Calendar,
  ExternalLink,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ThreadHeaderProps {
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200;
}

export function ThreadHeader(props: ThreadHeaderProps) {
  const t = useTranslations();

  return (
    <div className="mb-6">
      <Card className="border-primary">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="mb-2 text-2xl font-bold">{props.thread.name}</h1>
              {props.thread.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {props.thread.tags.map((tag) => (
                    <Badge key={tag.id} variant={"outline"}>
                      {tag.name} {tag.emoji.name ?? ""}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {props.thread.archived && (
                <Badge
                  variant="secondary"
                  className="gap-1"
                  title={
                    props.thread.archivedAt
                      ? dayjs(props.thread.archivedAt).format(
                          "MMMM D, YYYY [at] h:mm A",
                        )
                      : undefined
                  }
                >
                  <Archive className="h-3 w-3" />
                  {props.thread.archivedAt
                    ? t("SHOWCASE.ARCHIVED_AT", {
                        date: dayjs(props.thread.archivedAt).fromNow(),
                      })
                    : t("SHOWCASE.ARCHIVED")}
                </Badge>
              )}
              {props.thread.locked && (
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
                {t("SHOWCASE.MESSAGES_COUNT", {
                  count: props.thread.messageCount,
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              <span>
                {t("SHOWCASE.MEMBERS_COUNT", {
                  count: props.thread.memberCount,
                })}
              </span>
            </div>
            <div
              className="flex items-center gap-1.5"
              title={
                props.thread.createdAt
                  ? dayjs(props.thread.createdAt).format(
                      "MMMM D, YYYY [at] h:mm A",
                    )
                  : undefined
              }
            >
              <Calendar className="h-4 w-4" />
              <span>{dayjs(props.thread.createdAt).fromNow()}</span>
            </div>
            <Link
              href={getDiscordChannelLink(props.thread.id)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 flex items-center gap-1.5 transition-colors"
              title={t("SHOWCASE.OPEN_IN_DISCORD")}
            >
              <ExternalLink className="h-4 w-4" />
              <span>{t("SHOWCASE.OPEN_IN_DISCORD")}</span>
            </Link>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="items-start gap-3">
            {props.thread.author && <DiscordUser user={props.thread.author} />}

            <div className="flex-1">
              {props.thread.content && (
                <p className="text-sm whitespace-pre-wrap">
                  <DiscordMarkdown content={props.thread.content} />
                </p>
              )}

              {props.thread.imageUrl && (
                <Image
                  src={props.thread.imageUrl}
                  alt={props.thread.name}
                  width={800}
                  height={600}
                  className="rounded-lg"
                  unoptimized={props.thread.imageUrl.includes(".gif")}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
