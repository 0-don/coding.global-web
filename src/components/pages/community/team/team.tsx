"use client";

import { DiscordUser } from "@/components/elements/discord/discord-user";
import { useTeamQuery } from "@/hook/bot-hook";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { RiTeamFill } from "react-icons/ri";

export function Team() {
  const t = useTranslations();
  const { data: staffMembers } = useTeamQuery();

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
        <RiTeamFill className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("TEAM.HEADING")}</h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {(staffMembers ?? []).map((member, index) => (
          <motion.div
            key={member.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
          >
            <DiscordUser user={member} variant="card" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
