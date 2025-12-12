"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useNewsQuery } from "@/hook/bot-hook";
import type { GetApiByGuildIdNews200Item } from "@/openapi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useTranslations } from "next-intl";
import Image from "next/image";

dayjs.extend(relativeTime);

export function News() {
  const t = useTranslations();
  const newsQuery = useNewsQuery();

  const newsData = Array.isArray(newsQuery.data) ? newsQuery.data : [];

  return (
    <div className="container mx-auto mt-5">
      <Card className="bg-card/80 flex h-full flex-col px-10 py-5">
        <div className="mb-5">
          <h1 className="text-3xl font-bold">{t("NEWS.TITLE")}</h1>
        </div>
        <div className="mt-5 flex-1 overflow-y-auto px-1">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {newsData.map((news: GetApiByGuildIdNews200Item) => (
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
                    <Image
                      src={news.user.displayAvatarURL}
                      alt={news.user.username}
                      className="h-8 w-8 rounded-full"
                      width={32}
                      height={32}
                    />
                    <div>
                      <h3 className="text-sm font-semibold">
                        {news.user.globalName || news.user.username}
                      </h3>
                      <p className="text-muted-foreground text-xs">
                        {dayjs(news.createdAt).fromNow()}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                {news.content && (
                  <CardContent>
                    <p className="text-sm">{news.content}</p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
