"use client";

import { motion, useInView } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useTopStatsQuery } from "@/hook/bot-hook";
import { Heart, MessageSquare, Mic } from "lucide-react";
import { DiscordUser } from "@/components/elements/discord/discord-user";
import {
  GetApiByGuildIdTopStats200MostActiveMessageUsersItem,
  GetApiByGuildIdTopStats200MostActiveVoiceUsersItem,
  GetApiByGuildIdTopStats200MostHelpfulUsersItem,
} from "@/openapi";

type TopStatsUser =
  | GetApiByGuildIdTopStats200MostActiveMessageUsersItem
  | GetApiByGuildIdTopStats200MostHelpfulUsersItem
  | GetApiByGuildIdTopStats200MostActiveVoiceUsersItem;

interface ContributorCardProps {
  title: string;
  icon: React.ReactNode;
  contributors: TopStatsUser[];
  formatValue: (user: TopStatsUser) => string;
  index: number;
  inView: boolean;
  accentColor: string;
}

function ContributorCard(props: ContributorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={props.inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: props.index * 0.15 }}
    >
      <Card className="h-full">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`rounded-lg p-2 ${props.accentColor}`}>
              {props.icon}
            </div>
            {props.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {props.contributors.slice(0, 5).map((contributor, idx) => (
            <motion.div
              key={contributor.id as string}
              initial={{ opacity: 0, x: -20 }}
              animate={props.inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: props.index * 0.15 + idx * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-muted-foreground w-4 text-sm font-medium">
                {idx + 1}.
              </span>
              <DiscordUser
                className="flex-1"
                user={contributor as Parameters<typeof DiscordUser>[0]["user"]}
              />
              <Badge variant="secondary" className="text-xs">
                {props.formatValue(contributor)}
              </Badge>
            </motion.div>
          ))}
          {props.contributors.length === 0 && (
            <p className="text-muted-foreground text-sm">No data available</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function TopContributors() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: stats } = useTopStatsQuery();

  const columns = [
    {
      title: t("HOME.CONTRIBUTORS_HELPERS"),
      icon: <Heart className="h-4 w-4 text-pink-500" />,
      contributors: stats?.mostHelpfulUsers ?? [],
      formatValue: (u: TopStatsUser) =>
        t("HOME.CONTRIBUTORS_HELPERS_COUNT", { count: "count" in u ? u.count : 0 }),
      accentColor: "bg-pink-500/10",
    },
    {
      title: t("HOME.CONTRIBUTORS_MESSAGES"),
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      contributors: stats?.mostActiveMessageUsers ?? [],
      formatValue: (u: TopStatsUser) =>
        t("HOME.CONTRIBUTORS_MESSAGES_COUNT", { count: "count" in u ? u.count : 0 }),
      accentColor: "bg-blue-500/10",
    },
    {
      title: t("HOME.CONTRIBUTORS_VOICE"),
      icon: <Mic className="h-4 w-4 text-green-500" />,
      contributors: stats?.mostActiveVoiceUsers ?? [],
      formatValue: (u: TopStatsUser) =>
        t("HOME.CONTRIBUTORS_VOICE_HOURS", { hours: ("sum" in u ? u.sum : 0).toFixed(0) }),
      accentColor: "bg-green-500/10",
    },
  ];

  return (
    <div ref={ref} className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mb-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold md:text-4xl">
          {t("HOME.CONTRIBUTORS_TITLE")}
        </h2>
        <p className="text-muted-foreground text-lg">
          {t("HOME.CONTRIBUTORS_SUBTITLE")}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {columns.map((column, index) => (
          <ContributorCard
            key={column.title}
            title={column.title}
            icon={column.icon}
            contributors={column.contributors}
            formatValue={column.formatValue}
            index={index}
            inView={inView}
            accentColor={column.accentColor}
          />
        ))}
      </div>
    </div>
  );
}
