"use client";

import { motion, useInView } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useRef, Suspense } from "react";
import { DiscordWidget } from "./discord-widget";
import { DiscordWidgetSkeleton } from "./discord-widget-skeleton";
import { useNewsQuery } from "@/hook/bot-hook";
import { DiscordMarkdown } from "@/components/elements/discord/discord-markdown";
import { Newspaper } from "lucide-react";
import Link from "next/link";

function NewsPreview() {
  const t = useTranslations();
  const { data: news } = useNewsQuery();

  const latestNews = news?.slice(0, 3) ?? [];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="bg-primary/10 rounded-lg p-2">
            <Newspaper className="text-primary h-4 w-4" />
          </div>
          {t("HOME.COMMUNITY_NEWS_TITLE")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {latestNews.map((item) => (
          <Link
            key={item.id}
            href="/community/news"
            className="hover:bg-muted/50 block rounded-lg p-3 transition-colors"
          >
            <div className="mb-1 flex items-center gap-2">
              <span className="text-sm font-medium">{item.author?.username}</span>
              <span className="text-muted-foreground text-xs">
                {new Date(item.createdAt).toLocaleDateString()}
              </span>
            </div>
            <DiscordMarkdown
              content={item.content}
              className="text-muted-foreground line-clamp-2 text-sm"
            />
          </Link>
        ))}
        {latestNews.length === 0 && (
          <p className="text-muted-foreground text-sm">No news available</p>
        )}
      </CardContent>
    </Card>
  );
}

export function CommunityPreview() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          {t("HOME.COMMUNITY_TITLE")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("HOME.COMMUNITY_SUBTITLE")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Suspense fallback={<DiscordWidgetSkeleton className="h-full" />}>
            <DiscordWidget className="h-full" />
          </Suspense>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Suspense
            fallback={
              <Card className="h-full">
                <CardContent className="flex h-64 items-center justify-center">
                  <div className="bg-muted h-4 w-32 animate-pulse rounded" />
                </CardContent>
              </Card>
            }
          >
            <NewsPreview />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
