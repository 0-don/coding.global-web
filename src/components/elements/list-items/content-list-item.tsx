"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";
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

type ContentListItemProps = {
  data: GetApiByGuildIdBoardByBoardType200Item;
  href?: ComponentProps<typeof Link>["href"];
  className?: string;
};

export function ContentListItem({
  data,
  href,
  className,
}: ContentListItemProps) {
  const t = useTranslations();

  const content = (
    <div
      className={cn(
        "group border-border bg-card hover:bg-muted/50 flex gap-4 rounded-md border p-4 transition-colors",
        className,
      )}
    >
      {/* Thumbnail - Fixed 128px width */}
      <div className="bg-muted relative h-20 w-32 shrink-0 overflow-hidden rounded">
        {data.imageUrl ? (
          <Image
            src={data.imageUrl}
            alt={data.name}
            fill
            unoptimized
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
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {/* Title Row */}
        <div className="flex items-start gap-2">
          <h3 className="line-clamp-1 flex-1 text-base font-semibold group-hover:underline">
            {data.name}
          </h3>
          <div className="flex shrink-0 items-center gap-2">
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
              <Badge key={tag.id} className="text-xs">
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <DiscordUser user={data.author} />
          </div>

          <div className="text-muted-foreground flex items-center gap-4 text-xs">
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
