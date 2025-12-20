"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import {
  GetApiByGuildIdBoardByBoardType200Item,
  GetApiByGuildIdNews200Item,
} from "@/openapi";
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
import { ComponentProps } from "react";

dayjs.extend(relativeTime);

type BaseContentCardProps = {
  className?: string;
};

type MessageCardProps = BaseContentCardProps & {
  type: "message";
  data: GetApiByGuildIdNews200Item;
};

type ThreadCardProps = BaseContentCardProps & {
  type: "thread";
  data: GetApiByGuildIdBoardByBoardType200Item;
  href?: ComponentProps<typeof Link>["href"];
};

type ContentCardProps = MessageCardProps | ThreadCardProps;

export function ContentCard(props: ContentCardProps) {
  const t = useTranslations();
  const { type, data, className } = props;

  const isMessage = type === "message";
  const isThread = type === "thread";

  // Image setup
  const imageUrl = isMessage
    ? data.attachments[0]?.url
    : (data as GetApiByGuildIdBoardByBoardType200Item).imageUrl;
  const imageAlt = isMessage
    ? data.content
    : (data as GetApiByGuildIdBoardByBoardType200Item).name;

  // Content
  const cardContent = (
    <>
      {/* Image */}
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            unoptimized={isThread}
            className="object-cover"
            sizes={
              isMessage
                ? "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                : undefined
            }
            loading={isMessage ? "lazy" : undefined}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground h-16 w-16" />
          </div>
        )}
      </div>

      {/* Header */}
      <CardHeader className="group pt-5">
        {isThread ? (
          <>
            <div className="mb-2 flex">
              <h3 className="line-clamp-2 flex-1 text-xl font-semibold group-hover:underline">
                {(data as GetApiByGuildIdBoardByBoardType200Item).name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {(data as GetApiByGuildIdBoardByBoardType200Item).archived && (
                  <Badge
                    variant="secondary"
                    className="gap-1"
                    title={
                      (data as GetApiByGuildIdBoardByBoardType200Item)
                        .archivedAt
                        ? dayjs(
                            (data as GetApiByGuildIdBoardByBoardType200Item)
                              .archivedAt!,
                          ).format("MMMM D, YYYY [at] h:mm A")
                        : undefined
                    }
                  >
                    <Archive className="h-3 w-3" />
                    {(data as GetApiByGuildIdBoardByBoardType200Item).archivedAt
                      ? t("SHOWCASE.ARCHIVED_AT", {
                          date: dayjs(
                            (data as GetApiByGuildIdBoardByBoardType200Item)
                              .archivedAt!,
                          ).fromNow(),
                        })
                      : t("SHOWCASE.ARCHIVED")}
                  </Badge>
                )}
                {(data as GetApiByGuildIdBoardByBoardType200Item).locked && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    {t("SHOWCASE.LOCKED")}
                  </Badge>
                )}
              </div>
            </div>
            {(data as GetApiByGuildIdBoardByBoardType200Item).tags.length >
              0 && (
              <div className="mb-1 flex flex-wrap gap-2">
                {(data as GetApiByGuildIdBoardByBoardType200Item).tags.map(
                  (tag) => (
                    <Badge key={tag.id}>
                      {tag.name} {tag.emoji.name}
                    </Badge>
                  ),
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <DiscordUser user={data.author} />
          </div>
        )}
      </CardHeader>

      {/* Content */}
      <CardContent className="mt-auto pt-0">
        {data.content && (
          <DiscordMarkdown
            content={data.content}
            className="text-muted-foreground mb-3 line-clamp-3 text-sm"
          />
        )}

        {/* Footer metadata */}
        {isThread ? (
          <div className="flex items-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DiscordUser user={data.author} />
            </div>

            <div className="text-muted-foreground flex flex-1 flex-col items-end justify-end gap-0.5 text-xs">
              <div className="hover:text-foreground flex items-center gap-2">
                <span>
                  {t("SHOWCASE.MESSAGES_COUNT", {
                    count: (data as GetApiByGuildIdBoardByBoardType200Item)
                      .messageCount,
                  })}
                </span>
                <MessageCircle className="h-4 w-4" />
              </div>

              <div className="hover:text-foreground flex items-center gap-2">
                <span>
                  {t("SHOWCASE.MEMBERS_COUNT", {
                    count: (data as GetApiByGuildIdBoardByBoardType200Item)
                      .memberCount,
                  })}
                </span>
                <Users className="h-4 w-4" />
              </div>

              <div
                className="hover:text-foreground flex items-center gap-2"
                title={dayjs(data.createdAt).format("MMMM D, YYYY [at] h:mm A")}
              >
                <span>{dayjs(data.createdAt).fromNow()}</span>
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div
              className="hover:text-foreground flex items-center gap-2"
              title={dayjs(data.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            >
              <Calendar className="h-4 w-4" />
              <span>{dayjs(data.createdAt).fromNow()}</span>
            </div>

            {(data as GetApiByGuildIdNews200Item).reactions.length > 0 && (
              <div className="hover:text-foreground flex items-center gap-1">
                {(data as GetApiByGuildIdNews200Item).reactions
                  .slice(0, 3)
                  .map((reaction, idx) => (
                    <span key={idx} className="text-base">
                      {reaction.emoji.name}
                    </span>
                  ))}
                <span className="ml-1">
                  {(data as GetApiByGuildIdNews200Item).reactions.reduce(
                    (sum, r) => sum + r.count,
                    0,
                  )}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );

  // Wrapper with optional link
  const href = isThread ? (props as ThreadCardProps).href : undefined;

  if (href) {
    return (
      <Card
        className={`overflow-hidden pt-0 transition-shadow hover:shadow-lg ${className || ""}`}
      >
        <Link href={href} className="flex h-full cursor-pointer flex-col">
          {cardContent}
        </Link>
      </Card>
    );
  }

  return (
    <Card
      className={`overflow-hidden pt-0 transition-shadow hover:shadow-lg ${className || ""}`}
    >
      <div className="flex h-full flex-col">{cardContent}</div>
    </Card>
  );
}
