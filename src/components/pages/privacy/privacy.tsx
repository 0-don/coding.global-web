"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { FaShieldAlt } from "react-icons/fa";

const SECTION_KEYS = [
  "INTRO",
  "DATA_COLLECTED",
  "MEMBER_DATA",
  "MESSAGE_DATA",
  "PRESENCE_DATA",
  "AI_USAGE",
  "STORAGE",
  "RETENTION",
  "SHARING",
  "OPT_OUT",
  "RIGHTS",
  "CONTACT",
] as const;

export function Privacy() {
  const t = useTranslations();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto max-w-3xl px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center gap-2 py-6"
      >
        <FaShieldAlt className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("PRIVACY.HEADING")}</h1>
      </motion.div>

      <p className="text-muted-foreground mb-6 text-center text-sm">
        {t("PRIVACY.LAST_UPDATED")}
      </p>

      <div className="space-y-4">
        {SECTION_KEYS.map((key, index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Card className="border-l-primary border-l-4">
              <CardHeader className="pb-2">
                <h2 className="text-xl font-semibold">
                  {t(`PRIVACY.SECTIONS.${key}.TITLE`)}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm whitespace-pre-line">
                  {t(`PRIVACY.SECTIONS.${key}.BODY`)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
