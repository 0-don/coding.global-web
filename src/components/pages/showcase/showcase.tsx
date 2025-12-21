"use client";

import { ContentCard } from "@/components/elements/content-card";
import { ContentListItem } from "@/components/elements/content-list-item";
import { ViewModeToggle } from "@/components/elements/view-mode-toggle";
import { Separator } from "@/components/ui/separator";
import { useShowcaseThreadsQuery } from "@/hook/bot-hook";
import { useViewModeStore } from "@/lib/stores/view-mode-store";
import { useTranslations } from "next-intl";
import { HiOutlineTrophy } from "react-icons/hi2";

export function Showcase() {
  const t = useTranslations();
  const showcaseThreadsQuery = useShowcaseThreadsQuery();
  const viewMode = useViewModeStore((state) => state.viewMode);

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header with Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6">
        <div className="flex items-center gap-2">
          <HiOutlineTrophy className="text-3xl" />
          <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
        </div>
        <ViewModeToggle />
      </div>

      {/* Conditional Rendering */}
      {viewMode === "grid" ? (
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
              contentClassName="text-muted-foreground"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {showcaseThreadsQuery.data?.map((thread, index) => (
            <div key={thread.id}>
              <ContentListItem
                data={thread}
                href={{
                  pathname: "/showcase/[id]",
                  params: { id: thread.id },
                }}
              />
              {showcaseThreadsQuery.data &&
                index < showcaseThreadsQuery.data.length - 1 && (
                  <Separator className="my-1" />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
