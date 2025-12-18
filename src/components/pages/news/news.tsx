"use client";

import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNewsQuery } from "@/hook/bot-hook";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ImNewspaper } from "react-icons/im";

dayjs.extend(relativeTime);

export function News() {
  const t = useTranslations();
  const newsQuery = useNewsQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <ImNewspaper className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("NEWS.TITLE")}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(newsQuery.data || []).map((news) => (
            <Card key={news.id} className="overflow-hidden">
              {news.attachments.length > 0 && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={news.attachments[0].url}
                    alt={news.content}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    loading="lazy"
                  />
                </div>
              )}
              <CardHeader className="flex items-start gap-4">
                <div className="flex items-center gap-3">
                  <DiscordUser user={news.user!} />
                </div>
              </CardHeader>
              {news.content && (
                <CardContent>
                  <DiscordMarkdown content={news.content} className="text-sm" />
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
