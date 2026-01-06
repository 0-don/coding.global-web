"use client";

import { motion, useInView } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import { useTopStatsQuery } from "@/hook/bot-hook";
import { Heart, MessageSquare, Mic } from "lucide-react";

interface ContributorCardProps {
  title: string;
  icon: React.ReactNode;
  contributors: Array<{
    memberId: string;
    username: string;
    value: number;
  }>;
  formatValue: (value: number) => string;
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
              key={contributor.memberId}
              initial={{ opacity: 0, x: -20 }}
              animate={props.inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: props.index * 0.15 + idx * 0.1 }}
              className="flex items-center gap-3"
            >
              <span className="text-muted-foreground w-4 text-sm font-medium">
                {idx + 1}.
              </span>
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={`https://cdn.discordapp.com/avatars/${contributor.memberId}/${contributor.memberId}.webp`}
                  alt={contributor.username}
                />
                <AvatarFallback>
                  {contributor.username?.charAt(0)?.toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate text-sm font-medium">
                {contributor.username ?? "Unknown"}
              </span>
              <Badge variant="secondary" className="text-xs">
                {props.formatValue(contributor.value)}
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
      contributors: (stats?.mostHelpfulUsers ?? []).map((u) => ({
        memberId: u.memberId,
        username: u.username,
        value: u.count,
      })),
      formatValue: (v: number) => t("HOME.CONTRIBUTORS_HELPERS_COUNT", { count: v }),
      accentColor: "bg-pink-500/10",
    },
    {
      title: t("HOME.CONTRIBUTORS_MESSAGES"),
      icon: <MessageSquare className="h-4 w-4 text-blue-500" />,
      contributors: (stats?.mostActiveMessageUsers ?? []).map((u) => ({
        memberId: u.memberId,
        username: u.username,
        value: u.count,
      })),
      formatValue: (v: number) => t("HOME.CONTRIBUTORS_MESSAGES_COUNT", { count: v }),
      accentColor: "bg-blue-500/10",
    },
    {
      title: t("HOME.CONTRIBUTORS_VOICE"),
      icon: <Mic className="h-4 w-4 text-green-500" />,
      contributors: (stats?.mostActiveVoiceUsers ?? []).map((u) => ({
        memberId: u.memberId,
        username: u.username,
        value: u.sum,
      })),
      formatValue: (v: number) => t("HOME.CONTRIBUTORS_VOICE_HOURS", { hours: v.toFixed(0) }),
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
