"use client";

import { ContentCard } from "@/components/elements/content-card";
import { useShowcaseThreadsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { HiOutlineTrophy } from "react-icons/hi2";

export function Showcase() {
  const t = useTranslations();
  const showcaseThreadsQuery = useShowcaseThreadsQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 p-6">
        <HiOutlineTrophy className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {showcaseThreadsQuery.data?.map((thread) => (
          <ContentCard
            key={thread.id}
            type="thread"
            data={thread}
            href={{
              pathname: "/showcase/[id]",
              params: { id: thread.id },
            }}
          />
        ))}
      </div>
    </div>
  );
}
