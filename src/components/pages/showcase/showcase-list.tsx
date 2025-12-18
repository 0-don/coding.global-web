"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useShowcaseThreadsQuery } from "@/hook/showcase-hook";
import { Link } from "@/i18n/navigation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MessageCircle } from "lucide-react";
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

      {showcaseThreadsQuery.data?.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">{t("SHOWCASE.EMPTY.THREADS")}</p>
        </div>
      ) : (
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
                {thread.previewImage && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={thread.previewImage}
                      alt={thread.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader className="pt-3">
                  <h3 className="line-clamp-2 text-xl font-semibold">
                    {thread.name}
                  </h3>
                  {thread.tags && thread.tags.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {thread.tags.map((tag) => (
                        <Badge key={tag.id}>
                          {tag.name} {tag.emoji.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  {thread.author && (
                    <div className="mb-3 flex items-center gap-2">
                      <DiscordUser user={thread.author} />
                    </div>
                  )}
                  {thread.previewText && (
                    <DiscordMarkdown
                      content={thread.previewText}
                      className="text-muted-foreground mb-3 line-clamp-3 text-sm"
                    />
                  )}
                  <div className="text-muted-foreground flex items-center gap-2 text-sm">
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
