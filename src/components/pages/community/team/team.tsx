"use client";

import { DiscordUser } from "@/components/elements/discord/discord-user";
import { useTeamQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { RiTeamFill } from "react-icons/ri";

export function Team() {
  const t = useTranslations();
  const { data: staffMembers } = useTeamQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <RiTeamFill className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("TEAM.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {(staffMembers ?? []).map((member) => (
          <DiscordUser key={member.id} user={member} variant="card" />
        ))}
      </div>
    </div>
  );
}
