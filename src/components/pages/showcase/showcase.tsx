"use client";

import { ContentCard } from "@/components/elements/list-items/content-card";
import { ContentListItem } from "@/components/elements/list-items/content-list-item";
import { ViewModeToggle } from "@/components/elements/view-mode-toggle";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useShowcaseThreadsQuery } from "@/hook/bot-hook";
import { useListItemsStore } from "@/lib/stores/list-item-store";
import { useTranslations } from "next-intl";
import { HiOutlineTrophy } from "react-icons/hi2";

export function Showcase() {
  const t = useTranslations();
  const showcaseThreadsQuery = useShowcaseThreadsQuery();
  const { viewMode, searchQuery, setSearchQuery, filterItems } =
    useListItemsStore();

  const filteredThreads = filterItems(showcaseThreadsQuery.data || []);

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header with Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <HiOutlineTrophy className="text-3xl" />
          <h1 className="text-3xl font-bold">{t("SHOWCASE.HEADING")}</h1>
        </div>
        <ViewModeToggle />
      </div>

      {/* Search Input */}
      <div className="pb-6">
        <Input
          type="text"
          placeholder="Search threads by name, content, author, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conditional Rendering */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredThreads.map((thread) => (
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
          {filteredThreads.map((thread, index) => (
            <div key={thread.id}>
              <ContentListItem
                data={thread}
                href={{
                  pathname: "/showcase/[id]",
                  params: { id: thread.id },
                }}
              />
              {index < filteredThreads.length - 1 && (
                <Separator className="my-1" />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
