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
  ImageIcon,
  Lock,
  MessageCircle,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { HiOutlineTrophy } from "react-icons/hi2";

dayjs.extend(relativeTime);

export function ShowcaseList() {
  const t = useTranslations();
  const showcaseThreadsQuery = useShowcaseThreadsQuery();

  console.log(
    showcaseThreadsQuery.data?.find((thread) => thread.author == null),
  );

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 p-6">
        <HiOutlineTrophy className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcaseThreadsQuery.data?.map((thread) => (
          <Card
            key={thread.id}
            className="overflow-hidden pt-0 transition-shadow hover:shadow-lg"
          >
            <Link
              href={{
                pathname: "/showcase/[id]",
                params: { id: thread.id },
              }}
              className="flex h-full cursor-pointer flex-col"
            >
              <div className="bg-muted relative aspect-video w-full overflow-hidden">
                {thread.imageUrl ? (
                  <Image
                    src={thread.imageUrl}
                    alt={thread.name}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <ImageIcon className="text-muted-foreground h-16 w-16" />
                  </div>
                )}
              </div>
              <CardHeader className="pt-5">
                <div className="mb-2 flex">
                  <h3 className="line-clamp-2 flex-1 text-xl font-semibold">
                    {thread.name}
                  </h3>
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
                {thread.tags.length > 0 && (
                  <div className="mb-1 flex flex-wrap gap-2">
                    {thread.tags.map((tag) => (
                      <Badge key={tag.id}>
                        {tag.name} {tag.emoji.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent className="mt-auto pt-0">
                {thread.content && (
                  <DiscordMarkdown
                    content={thread.content}
                    className="text-muted-foreground mb-3 line-clamp-3 text-sm"
                  />
                )}

                <div className="flex items-center">
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <DiscordUser user={thread.author} />
                  </div>

                  <div className="text-muted-foreground flex flex-1 flex-col items-end justify-end gap-0.5 text-xs">
                    <div className="hover:text-foreground flex items-center gap-2">
                      <span>
                        {t("SHOWCASE.MESSAGES_COUNT", {
                          count: thread.messageCount,
                        })}
                      </span>
                      <MessageCircle className="h-4 w-4" />
                    </div>

                    <div className="hover:text-foreground flex items-center gap-2">
                      <span>
                        {t("SHOWCASE.MEMBERS_COUNT", {
                          count: thread.memberCount,
                        })}
                      </span>
                      <Users className="h-4 w-4" />
                    </div>

                    <div
                      className="hover:text-foreground flex items-center gap-2"
                      title={dayjs(thread.createdAt).format(
                        "MMMM D, YYYY [at] h:mm A",
                      )}
                    >
                      <span>{dayjs(thread.createdAt).fromNow()}</span>
                      <Calendar className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
