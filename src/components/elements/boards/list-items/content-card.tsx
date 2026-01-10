"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
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
  contentClassName?: string;
};

type MessageCardProps = BaseContentCardProps & {
  type: "message";
  data: GetApiByGuildIdNews200Item;
};

type ThreadCardProps = BaseContentCardProps & {
  type: "thread";
  data: GetApiByGuildIdBoardByBoardType200Item;
  href?: ComponentProps<typeof Link>["href"];
  showBoardBadge?: boolean;
  boardType?: "job-board" | "dev-board";
};

type ContentCardProps = MessageCardProps | ThreadCardProps;

function getImageData(props: ContentCardProps) {
  if (props.type === "message") {
    return {
      url: props.data.attachments[0]?.url,
      alt: props.data.content,
      unoptimized: props.data.attachments[0]?.url.includes(".gif"),
      sizes:
        "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" as const,
      loading: "lazy" as const,
    };
  }

  return {
    url: props.data.imageUrl,
    alt: props.data.name,
    unoptimized: props.data.imageUrl?.includes(".gif"),
    sizes: "(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw" as const,
    loading: "lazy" as const,
  };
}

export function ContentCard(props: ContentCardProps) {
  const t = useTranslations();
  const imageData = getImageData(props);

  const cardContent = (
    <>
      <div className="bg-muted relative aspect-video w-full overflow-hidden">
        {imageData.url ? (
          <Image
            src={imageData.url}
            alt={imageData.alt}
            fill
            unoptimized={imageData.unoptimized}
            className="object-cover"
            sizes={imageData.sizes}
            loading={imageData.loading}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground h-16 w-16" />
          </div>
        )}
      </div>

      <CardHeader className="group pt-5">
        {props.type === "thread" ? (
          <>
            <div className="mb-2 flex items-center gap-2">
              <h3 className="line-clamp-2 flex-1 text-xl font-semibold group-hover:underline">
                {props.data.name}
              </h3>
              <div className="flex flex-wrap items-center gap-2">
                {props.showBoardBadge && props.boardType && (
                  <Badge
                    variant={
                      props.boardType === "job-board" ? "default" : "secondary"
                    }
                    className="shrink-0"
                  >
                    {props.boardType === "job-board"
                      ? t("MARKETPLACE.BADGE.JOB")
                      : t("MARKETPLACE.BADGE.DEV")}
                  </Badge>
                )}
                {props.data.archived && (
                  <Badge
                    variant="secondary"
                    className="gap-1"
                    title={
                      props.data.archivedAt
                        ? dayjs(props.data.archivedAt).format(
                            "MMMM D, YYYY [at] h:mm A",
                          )
                        : undefined
                    }
                  >
                    <Archive className="h-3 w-3" />
                    {props.data.archivedAt
                      ? t("SHOWCASE.ARCHIVED_AT", {
                          date: dayjs(props.data.archivedAt).fromNow(),
                        })
                      : t("SHOWCASE.ARCHIVED")}
                  </Badge>
                )}
                {props.data.locked && (
                  <Badge variant="outline" className="gap-1">
                    <Lock className="h-3 w-3" />
                    {t("SHOWCASE.LOCKED")}
                  </Badge>
                )}
              </div>
            </div>
            {props.data.tags.length > 0 && (
              <div className="mb-1 flex flex-wrap gap-2">
                {props.data.tags.map((tag) => (
                  <Badge key={tag.id} variant={"outline"}>
                    {tag.name} {tag.emoji.name}
                  </Badge>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center gap-3">
            <DiscordUser user={props.data.author} />
          </div>
        )}
      </CardHeader>

      <CardContent className="mt-auto pt-0">
        {props.data.content && (
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DiscordMarkdown
              content={props.data.content}
              className={cn(
                "mb-3 line-clamp-3 text-sm",
                props.contentClassName,
              )}
            />
          </div>
        )}

        {props.type === "thread" ? (
          <div className="flex items-center">
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <DiscordUser user={props.data.author} />
            </div>

            <div className="text-muted-foreground flex flex-1 flex-col items-end justify-end gap-0.5 text-xs">
              <div className="hover:text-foreground flex items-center gap-2">
                <span>
                  {t("SHOWCASE.MESSAGES_COUNT", {
                    count: props.data.messageCount,
                  })}
                </span>
                <MessageCircle className="h-4 w-4" />
              </div>

              <div className="hover:text-foreground flex items-center gap-2">
                <span>
                  {t("SHOWCASE.MEMBERS_COUNT", {
                    count: props.data.memberCount,
                  })}
                </span>
                <Users className="h-4 w-4" />
              </div>

              <div
                className="hover:text-foreground flex items-center gap-2"
                title={dayjs(props.data.createdAt).format(
                  "MMMM D, YYYY [at] h:mm A",
                )}
              >
                <span>{dayjs(props.data.createdAt).fromNow()}</span>
                <Calendar className="h-4 w-4" />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <div
              className="hover:text-foreground flex items-center gap-2"
              title={dayjs(props.data.createdAt).format(
                "MMMM D, YYYY [at] h:mm A",
              )}
            >
              <Calendar className="h-4 w-4" />
              <span>{dayjs(props.data.createdAt).fromNow()}</span>
            </div>

            {props.data.reactions.length > 0 && (
              <div className="hover:text-foreground flex items-center gap-1">
                {props.data.reactions.slice(0, 3).map((reaction, idx) => (
                  <span key={idx} className="text-base">
                    {reaction.emoji.name}
                  </span>
                ))}
                <span className="ml-1">
                  {props.data.reactions.reduce((sum, r) => sum + r.count, 0)}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </>
  );

  const href = props.type === "thread" ? props.href : undefined;

  if (href) {
    return (
      <Card
        className={`h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg ${props.className || ""}`}
      >
        <Link href={href} className="flex h-full cursor-pointer flex-col">
          {cardContent}
        </Link>
      </Card>
    );
  }

  return (
    <Card
      className={`h-full overflow-hidden pt-0 transition-shadow hover:shadow-lg ${props.className || ""}`}
    >
      <div className="flex h-full flex-col">{cardContent}</div>
    </Card>
  );
}
