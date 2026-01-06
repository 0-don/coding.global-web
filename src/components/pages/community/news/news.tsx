"use client";

import { ContentCard } from "@/components/elements/boards/list-items/content-card";
import { useNewsQuery } from "@/hook/bot-hook";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { ImNewspaper } from "react-icons/im";

export function News() {
  const t = useTranslations();
  const { data: news } = useNewsQuery();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 md:px-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center justify-center gap-2 py-6"
      >
        <ImNewspaper className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("NEWS.TITLE")}</h1>
      </motion.div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(news ?? []).map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              <ContentCard type="message" data={item} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
