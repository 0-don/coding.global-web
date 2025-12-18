"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useShowcaseThreadsQuery } from "@/hook/showcase-hook";
import { Link } from "@/i18n/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {
  Archive,
  Calendar,
  Clock,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";

dayjs.extend(relativeTime);

export function ShowcaseList() {
  const t = useTranslations();
  const showcaseThreadsQuery = useShowcaseThreadsQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 p-6">
        <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcaseThreadsQuery.data?.map((thread) => (
          <Link
            key={thread.id}
            href={{
              pathname: "/showcase/[id]",
              params: { id: thread.id },
            }}
          >
            <Card className="h-full cursor-pointer gap-2 overflow-hidden pt-0 transition-shadow hover:shadow-lg">
              {thread.imageUrl && (
                <div className="relative aspect-video w-full overflow-hidden">
                  <Image
                    src={thread.imageUrl}
                    alt={thread.name}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <CardHeader className="pt-3">
                <div className="mb-2 flex flex-wrap items-center gap-2">
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
                  {thread.rateLimitPerUser && thread.rateLimitPerUser > 0 && (
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {t("SHOWCASE.SLOWMODE", {
                        seconds: thread.rateLimitPerUser,
                      })}
                    </Badge>
                  )}
                </div>
                <h3 className="line-clamp-2 text-xl font-semibold">
                  {thread.name}
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {thread.tags.map((tag) => (
                    <Badge key={tag.id}>
                      {tag.name} {tag.emoji.name}
                    </Badge>
                  ))}
                </div>
              </CardHeader>
              <CardContent>
                {thread.author && (
                  <div className="mb-3 flex items-center gap-2">
                    <DiscordUser user={thread.author} />
                  </div>
                )}
                {thread.content && (
                  <DiscordMarkdown
                    content={thread.content}
                    className="text-muted-foreground mb-3 line-clamp-3 text-sm"
                  />
                )}
                <div className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>
                      {t("SHOWCASE.MESSAGES_COUNT", {
                        count: thread.messageCount || 0,
                      })}
                    </span>
                  </div>
                  {thread.memberCount != null && thread.memberCount > 0 && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>
                        {t("SHOWCASE.MEMBERS_COUNT", {
                          count: thread.memberCount,
                        })}
                      </span>
                    </div>
                  )}
                  {thread.createdAt && (
                    <div
                      className="flex items-center gap-2"
                      title={dayjs(thread.createdAt).format()}
                    >
                      <Calendar className="h-4 w-4" />
                      <span>{dayjs(thread.createdAt).fromNow()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
