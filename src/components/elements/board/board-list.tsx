"use client";

import { ContentCard } from "@/components/elements/list-items/content-card";
import { ContentListItem } from "@/components/elements/list-items/content-list-item";
import { TagFilter } from "@/components/elements/list-items/tag-filter";
import { ViewModeToggle } from "@/components/elements/list-items/view-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { BoardType, useListItemStore } from "@/lib/stores/list-item-store";
import {
  GetApiByGuildIdBoardByBoardType200Item,
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
} from "@/openapi";
import { useTranslations } from "next-intl";
import { ComponentProps } from "react";
import { IconType } from "react-icons/lib";
import { RxCross2 } from "react-icons/rx";

export type BoardItemWithType = GetApiByGuildIdBoardByBoardType200Item & {
  boardType?: GetApiByGuildIdBoardByBoardType200ItemBoardType;
};

interface BoardListProps {
  threads: GetApiByGuildIdBoardByBoardType200Item[];
  title: string;
  icon: IconType;
  showBoardBadge: boolean;
  getDetailHref: (
    thread: GetApiByGuildIdBoardByBoardType200Item,
  ) => ComponentProps<typeof Link>["href"];
  boardType: BoardType;
}

export function BoardList(props: BoardListProps) {
  const t = useTranslations();
  const listItemStore = useListItemStore(props.boardType);

  const filteredThreads = listItemStore.filterItems(props.threads);
  const hasActiveFilters =
    listItemStore.searchQuery.trim() || listItemStore.selectedTags.length > 0;

  return (
    <div className="container mx-auto px-4 md:px-6">
      {/* Header with Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-6">
        <div className="flex items-center gap-2">
          <props.icon className="text-3xl" />
          <h1 className="text-3xl font-bold">
            {props.title}
            <span className="text-muted-foreground ml-2 text-lg font-normal">
              ({filteredThreads.length})
            </span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={listItemStore.clearFilters}
              className="h-9 px-2 lg:px-3"
            >
              {t("SHOWCASE.RESET")}
              <RxCross2 className="ml-2 h-4 w-4" />
            </Button>
          )}
          <TagFilter threads={props.threads} boardType={props.boardType} />
          <ViewModeToggle boardType={props.boardType} />
        </div>
      </div>

      {/* Search Input */}
      <div className="pb-6">
        <Input
          type="text"
          placeholder={t("MARKETPLACE.SEARCH_PLACEHOLDER")}
          value={listItemStore.searchQuery}
          onChange={(e) => listItemStore.setSearchQuery(e.target.value)}
        />
      </div>

      {/* Conditional Rendering */}
      {listItemStore.viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredThreads.map((thread) => (
            <ContentCard
              key={thread.id}
              type="thread"
              data={thread}
              href={props.getDetailHref(thread)}
              contentClassName="text-muted-foreground"
              showBoardBadge={props.showBoardBadge}
              boardType={
                thread.boardType as "job-board" | "dev-board" | undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredThreads.map((thread, index) => (
            <div key={thread.id}>
              <ContentListItem
                data={thread}
                href={props.getDetailHref(thread)}
                showBoardBadge={props.showBoardBadge}
                boardType={
                  thread.boardType as "job-board" | "dev-board" | undefined
                }
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
