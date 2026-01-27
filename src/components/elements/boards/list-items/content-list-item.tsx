"use client";

import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { DiscordMarkdown } from "@/components/ui/discord-markdown";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { dayjs } from "@/lib/utils/dayjs";
import { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
import { SortOrder } from "@/store/thread-store";
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
import posthog from "posthog-js";
import { ComponentProps } from "react";

type ContentListItemProps = {
  data: GetApiByGuildIdThreadByThreadType200Item;
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
  showBoardBadge?: boolean;
  threadType?: "job-board" | "dev-board";
  sortOrder?: SortOrder;
};

export function ContentListItem(props: ContentListItemProps) {
  const t = useTranslations();

  const displayDate =
    props.sortOrder === "recentlyActive"
      ? props.data.lastActivityAt
      : props.data.createdAt;

  const content = (
    <div
      className={cn(
        "group border-border bg-card hover:bg-muted/85 flex gap-3 rounded-md border p-3 transition-colors md:gap-4 md:p-4",
        props.className,
      )}
    >
      {/* Thumbnail - Hidden on mobile, fixed 128px width on md+ */}
      <div className="bg-muted relative hidden h-20 w-32 shrink-0 overflow-hidden rounded md:block">
        {props.data.imageUrl ? (
          <Image
            src={props.data.imageUrl}
            alt={props.data.name}
            fill
            unoptimized={props.data.imageUrl.includes(".gif")}
            className="object-cover"
            sizes="128px"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageIcon className="text-muted-foreground h-8 w-8" />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 md:gap-2">
        {/* Title Row */}
        <div className="flex items-start gap-2">
          <h3 className="line-clamp-1 flex-1 text-base font-semibold group-hover:underline">
            {props.data.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {props.showBoardBadge && props.threadType && (
              <Badge
                variant={
                  props.threadType === "job-board" ? "default" : "secondary"
                }
                className="text-xs"
              >
                {props.threadType === "job-board"
                  ? t("MARKETPLACE.BADGE.JOB")
                  : t("MARKETPLACE.BADGE.DEV")}
              </Badge>
            )}
            {props.data.archived && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
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
              <Badge variant="outline" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                {t("SHOWCASE.LOCKED")}
              </Badge>
            )}
          </div>
        </div>

        {/* Tags Row */}
        {props.data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {props.data.tags.map((tag) => (
              <Badge key={tag.id} className="text-xs" variant={"outline"}>
                {tag.name} {tag.emoji.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Preview Text */}
        {props.data.content && (
          <DiscordMarkdown
            content={props.data.content}
            mentions={props.data.firstMessage?.mentions}
            className="text-muted-foreground line-clamp-2 text-sm"
          />
        )}

        {/* Bottom Row - Author and Stats */}
        <div className="flex flex-wrap items-center justify-between gap-2 md:gap-4">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DiscordUser user={props.data.author} />
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-xs md:gap-4">
            {props.data.firstMessage?.reactions &&
              props.data.firstMessage.reactions.length > 0 && (
                <div className="hover:text-foreground flex items-center gap-1">
                  {props.data.firstMessage.reactions
                    .slice(0, 3)
                    .map((reaction, idx) => (
                      <span key={idx} className="text-base">
                        {reaction.emoji.name}
                      </span>
                    ))}
                  <span className="ml-1">
                    {props.data.firstMessage.reactions.reduce(
                      (sum, r) => sum + r.count,
                      0,
                    )}
                  </span>
                </div>
              )}
            <div className="hover:text-foreground flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>
                {t("SHOWCASE.MESSAGES_COUNT", {
                  count: props.data.messageCount,
                })}
              </span>
            </div>
            <div className="hover:text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>
                {t("SHOWCASE.MEMBERS_COUNT", { count: props.data.memberCount })}
              </span>
            </div>
            <div
              className="hover:text-foreground flex items-center gap-1.5"
              title={dayjs(displayDate).format("MMMM D, YYYY [at] h:mm A")}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{dayjs(displayDate).fromNow()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (props.href) {
    const handleClick = () => {
      posthog.capture("thread_opened", {
        thread_id: props.data.id,
        thread_title: props.data.name,
        thread_type: props.threadType || "showcase",
      });
    };

    return (
      <Link href={props.href} className="block" onClick={handleClick}>
        {content}
      </Link>
    );
  }

  return content;
}
