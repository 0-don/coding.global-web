"use client";

import { ContentCard } from "@/components/elements/boards/list-items/content-card";
import { ContentListItem } from "@/components/elements/boards/list-items/content-list-item";
import { TagFilter } from "@/components/elements/boards/tag-filter";
import { ViewModeToggle } from "@/components/elements/boards/view-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { BoardType } from "@/lib/types";
import {
  GetApiByGuildIdBoardByBoardType200Item,
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
} from "@/openapi";
import { filterThreads, getThreadAtoms } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import type { IconType } from "react-icons/lib";
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
  const atoms = getThreadAtoms(props.boardType);

  const state = useAtomValue(atoms.baseAtom);
  const setSearchQuery = useSetAtom(atoms.searchQueryAtom);
  const clearFilters = useSetAtom(atoms.clearFiltersAtom);

  const filteredThreads = filterThreads(props.threads, state);
  const hasActiveFilters =
    state.searchQuery?.trim() || (state.selectedTags?.length ?? 0) > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 md:px-6"
    >
      {/* Header with Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-wrap items-center justify-between gap-4 py-6"
      >
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
              onClick={() => clearFilters()}
              className="h-9 px-2 lg:px-3"
            >
              {t("SHOWCASE.RESET")}
              <RxCross2 className="ml-2 h-4 w-4" />
            </Button>
          )}
          <TagFilter threads={props.threads} boardType={props.boardType} />
          <ViewModeToggle boardType={props.boardType} />
        </div>
      </motion.div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="pb-6"
      >
        <Input
          type="text"
          placeholder={t("MARKETPLACE.SEARCH_PLACEHOLDER")}
          value={state.searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </motion.div>

      {/* Conditional Rendering */}
      {state.viewMode === "grid" ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="h-full"
            >
              <ContentCard
                type="thread"
                data={thread}
                href={props.getDetailHref(thread)}
                contentClassName="text-muted-foreground"
                showBoardBadge={props.showBoardBadge}
                boardType={
                  thread.boardType as "job-board" | "dev-board" | undefined
                }
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col">
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: index * 0.03 }}
            >
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
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
