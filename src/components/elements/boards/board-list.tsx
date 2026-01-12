"use client";

import { ContentCard } from "@/components/elements/boards/list-items/content-card";
import { ContentListItem } from "@/components/elements/boards/list-items/content-list-item";
import { TagFilter } from "@/components/elements/boards/tag-filter";
import { ViewModeToggle } from "@/components/elements/boards/view-mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Link } from "@/i18n/navigation";
import { ApiThreadType, ThreadType } from "@/lib/types";
import { chunkArray } from "@/lib/utils/base";
import { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
import { filterThreads, getThreadAtoms } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import type { IconType } from "react-icons/lib";
import { RxCross2 } from "react-icons/rx";
import { VList } from "virtua";

export type BoardItemWithType = GetApiByGuildIdThreadByThreadType200Item & {
  threadType?: ApiThreadType;
};

interface BoardListProps {
  threads: GetApiByGuildIdThreadByThreadType200Item[];
  title: string;
  icon: IconType;
  showBoardBadge: boolean;
  getDetailHref: (
    thread: GetApiByGuildIdThreadByThreadType200Item,
  ) => ComponentProps<typeof Link>["href"];
  threadType: ThreadType;
}

export function BoardList(props: BoardListProps) {
  const t = useTranslations();
  const atoms = getThreadAtoms(props.threadType);

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
          <TagFilter threads={props.threads} threadType={props.threadType} />
          <ViewModeToggle threadType={props.threadType} />
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
        <VList style={{ height: "calc(100vh - 250px)" }}>
          {chunkArray(filteredThreads, 3).map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6 pb-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {row.map((thread) => (
                <motion.div
                  key={thread.id}
                  className="h-full"
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ContentCard
                    type="thread"
                    data={thread}
                    href={props.getDetailHref(thread)}
                    contentClassName="text-muted-foreground"
                    showBoardBadge={props.showBoardBadge}
                    threadType={
                      thread.boardType as "job-board" | "dev-board" | undefined
                    }
                  />
                </motion.div>
              ))}
            </motion.div>
          ))}
        </VList>
      ) : (
        <VList style={{ height: "calc(100vh - 250px)" }}>
          {filteredThreads.map((thread, index) => (
            <motion.div
              key={thread.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ContentListItem
                data={thread}
                href={props.getDetailHref(thread)}
                showBoardBadge={props.showBoardBadge}
                threadType={
                  thread.boardType as "job-board" | "dev-board" | undefined
                }
              />
              {index < filteredThreads.length - 1 && (
                <Separator className="my-1" />
              )}
            </motion.div>
          ))}
        </VList>
      )}
    </motion.div>
  );
}
