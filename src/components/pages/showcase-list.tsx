"use client";

import { useShowcaseThreadsQuery } from "@/hook/showcase-hook";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DiscordUserPopover } from "@/components/elements/discord/discord-user-popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/i18n/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import { MessageCircle } from "lucide-react";

dayjs.extend(relativeTime);

export function ShowcaseList() {
  const t = useTranslations();
  const { data: threads } = useShowcaseThreadsQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
      </div>

      {!threads || threads.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("SHOWCASE.EMPTY.THREADS")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {threads.map((thread) => (
            <Link key={thread.id} href={`/showcase/${thread.id}`}>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow h-full">
                <CardHeader>
                  <h3 className="text-xl font-semibold line-clamp-2">
                    {thread.name}
                  </h3>
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap mt-2">
                      {thread.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {thread.author && (
                    <div className="flex items-center gap-2 mb-3">
                      <DiscordUserPopover user={thread.author}>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={thread.author.displayAvatarURL} />
                          <AvatarFallback>
                            {thread.author.displayName?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </DiscordUserPopover>
                      <div className="flex-1 min-w-0">
                        <DiscordUserPopover user={thread.author}>
                          <p className="text-sm font-medium hover:underline cursor-pointer truncate">
                            {thread.author.displayName}
                          </p>
                        </DiscordUserPopover>
                        <p className="text-xs text-muted-foreground">
                          {dayjs(thread.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageCircle className="h-4 w-4" />
                    <span>
                      {t("SHOWCASE.MESSAGES_COUNT", {
                        count: thread.messageCount || 0,
                      })}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
