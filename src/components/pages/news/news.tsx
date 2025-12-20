"use client";

import { ContentCard } from "@/components/elements/content-card";
import { useNewsQuery } from "@/hook/bot-hook";
import { useTranslations } from "next-intl";
import { ImNewspaper } from "react-icons/im";

export function News() {
  const t = useTranslations();
  const newsQuery = useNewsQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <ImNewspaper className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("NEWS.TITLE")}</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-1">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(newsQuery.data || []).map((news) => (
            <ContentCard key={news.id} type="message" data={news} />
          ))}
        </div>
      </div>
    </div>
  );
}
