"use client";

import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { DiscordMarkdown } from "@/components/ui/discord-markdown";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { dayjs } from "@/lib/utils/dayjs";
import { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
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

type ContentListItemProps = {
  data: GetApiByGuildIdThreadByThreadType200Item;
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
  showBoardBadge?: boolean;
  threadType?: "job-board" | "dev-board";
};

export function ContentListItem({
  data,
  href,
  className,
  showBoardBadge,
  threadType,
}: ContentListItemProps) {
  const t = useTranslations();

  const content = (
    <div
      className={cn(
        "group border-border bg-card hover:bg-muted/85 flex gap-3 rounded-md border p-3 transition-colors md:gap-4 md:p-4",
        className,
      )}
    >
      {/* Thumbnail - Hidden on mobile, fixed 128px width on md+ */}
      <div className="bg-muted relative hidden h-20 w-32 shrink-0 overflow-hidden rounded md:block">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            unoptimized={data.imageUrl.includes(".gif")}
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
            {data.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
            {showBoardBadge && threadType && (
              <Badge
                variant={threadType === "job-board" ? "default" : "secondary"}
                className="text-xs"
              >
                {threadType === "job-board"
                  ? t("MARKETPLACE.BADGE.JOB")
                  : t("MARKETPLACE.BADGE.DEV")}
              </Badge>
            )}
            {data.archived && (
              <Badge
                variant="secondary"
                className="gap-1 text-xs"
                title={
                  data.archivedAt
                    ? dayjs(data.archivedAt).format("MMMM D, YYYY [at] h:mm A")
                    : undefined
                }
              >
                <Archive className="h-3 w-3" />
                {data.archivedAt
                  ? t("SHOWCASE.ARCHIVED_AT", {
                      date: dayjs(data.archivedAt).fromNow(),
                    })
                  : t("SHOWCASE.ARCHIVED")}
              </Badge>
            )}
            {data.locked && (
              <Badge variant="outline" className="gap-1 text-xs">
                <Lock className="h-3 w-3" />
                {t("SHOWCASE.LOCKED")}
              </Badge>
            )}
          </div>
        </div>

        {/* Tags Row */}
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {data.tags.map((tag) => (
              <Badge key={tag.id} className="text-xs" variant={"outline"}>
                {tag.name} {tag.emoji.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Preview Text */}
        {data.content && (
          <DiscordMarkdown
            content={data.content}
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
            <DiscordUser user={data.author} />
          </div>

          <div className="text-muted-foreground flex items-center gap-2 text-xs md:gap-4">
            {data.firstMessage?.reactions &&
              data.firstMessage.reactions.length > 0 && (
                <div className="hover:text-foreground flex items-center gap-1">
                  {data.firstMessage.reactions
                    .slice(0, 3)
                    .map((reaction, idx) => (
                      <span key={idx} className="text-base">
                        {reaction.emoji.name}
                      </span>
                    ))}
                  <span className="ml-1">
                    {data.firstMessage.reactions.reduce(
                      (sum, r) => sum + r.count,
                      0,
                    )}
                  </span>
                </div>
              )}
            <div className="hover:text-foreground flex items-center gap-1.5">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>
                {t("SHOWCASE.MESSAGES_COUNT", { count: data.messageCount })}
              </span>
            </div>
            <div className="hover:text-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              <span>
                {t("SHOWCASE.MEMBERS_COUNT", { count: data.memberCount })}
              </span>
            </div>
            <div
              className="hover:text-foreground flex items-center gap-1.5"
              title={dayjs(data.createdAt).format("MMMM D, YYYY [at] h:mm A")}
            >
              <Calendar className="h-3.5 w-3.5" />
              <span>{dayjs(data.createdAt).fromNow()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
