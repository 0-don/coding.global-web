"use client";

import { motion, useInView } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { useRef, useEffect, useState } from "react";
import { Users, Wifi, MessageSquare, Mic } from "lucide-react";
import { useDiscordWidget, useTopStatsQuery } from "@/hook/bot-hook";

function AnimatedCounter(props: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!props.inView) return;

    const duration = 2000;
    const steps = 60;
    const increment = props.value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= props.value) {
        setCount(props.value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [props.value, props.inView]);

  return <span>{count.toLocaleString()}</span>;
}

interface StatCardProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  index: number;
  inView: boolean;
}

function StatCard(props: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={props.inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: props.index * 0.1 }}
    >
      <Card className="border-primary/20 hover:border-primary/50 transition-colors">
        <CardContent className="flex flex-col items-center gap-2 py-6 text-center">
          <div className="text-primary mb-2">{props.icon}</div>
          <div className="text-4xl font-bold">
            <AnimatedCounter value={props.value} inView={props.inView} />
          </div>
          <div className="text-muted-foreground text-sm">{props.label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function StatsSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const { data: widget } = useDiscordWidget();
  const { data: topStats } = useTopStatsQuery();

  const stats = [
    {
      icon: <Users className="h-8 w-8" />,
      value: widget?.memberCount ?? 0,
      label: t("HOME.STATS_MEMBERS"),
    },
    {
      icon: <Wifi className="h-8 w-8" />,
      value: widget?.presenceCount ?? 0,
      label: t("HOME.STATS_ONLINE"),
    },
    {
      icon: <MessageSquare className="h-8 w-8" />,
      value: topStats?.totalMessages ?? 0,
      label: t("HOME.STATS_MESSAGES"),
    },
    {
      icon: <Mic className="h-8 w-8" />,
      value: topStats?.totalVoiceHours ?? 0,
      label: t("HOME.STATS_VOICE_HOURS"),
    },
  ];

  return (
    <div ref={ref} className="container mx-auto px-4">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {stats.map((stat, index) => (
          <StatCard
            key={stat.label}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            index={index}
            inView={inView}
          />
        ))}
      </div>
    </div>
  );
}
