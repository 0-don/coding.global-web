"use client";

import { motion } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { useTranslations } from "next-intl";
import Link from "next/link";

function TerminalTypingEffect(props: { text: string }) {
  return (
    <div className="flex items-center">
      <span className="mr-2 text-green-400">{">"}</span>
      {props.text.split("").map((char, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.03, delay: i * 0.03 }}
        >
          {char}
        </motion.span>
      ))}
      <motion.span
        className="ml-1"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        _
      </motion.span>
    </div>
  );
}

export function HeroSection() {
  const t = useTranslations();

  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
        className="flex flex-col items-center gap-8 text-center"
      >
        {/* Main heading with gradient */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="from-primary to-chart-2 bg-linear-to-r bg-clip-text text-5xl font-bold text-transparent md:text-7xl"
        >
          {t("HOME.HERO_TITLE")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="text-muted-foreground max-w-2xl text-xl md:text-2xl"
        >
          {t("HOME.HERO_SUBTITLE")}
        </motion.p>

        {/* Terminal window */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
          className="w-full max-w-md"
        >
          <Card className="border-primary font-mono text-sm">
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="bg-primary h-3 w-3 rounded-full" />
                <span className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </div>

              <div className="text-green-400">
                <TerminalTypingEffect text={t("HOME.HERO_TERMINAL_TEXT")} />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
          className="flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href={getDiscordInviteLink()}
            className={cn(buttonVariants({ size: "lg" }))}
          >
            {t("HOME.HERO_CTA_PRIMARY")}
          </Link>
          <Link
            href="/resources"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            {t("HOME.HERO_CTA_SECONDARY")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
