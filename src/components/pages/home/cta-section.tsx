"use client";

import { motion, useInView } from "motion/react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDiscordInviteLink } from "@/lib/utils/base";
import { useTranslations } from "next-intl";
import { useRef } from "react";
import Link from "next/link";

export function CtaSection() {
  const t = useTranslations();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center gap-6 text-center"
      >
        <h2 className="text-3xl font-bold md:text-5xl">
          {t("HOME.CTA_TITLE")}
        </h2>
        <p className="text-muted-foreground max-w-xl text-lg md:text-xl">
          {t("HOME.CTA_SUBTITLE")}
        </p>

        <motion.div
          animate={{
            scale: [1, 1.02, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <Link
            href={getDiscordInviteLink()}
            className={cn(buttonVariants({ size: "lg" }), "text-lg")}
          >
            {t("HOME.CTA_BUTTON")}
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
