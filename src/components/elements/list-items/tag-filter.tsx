"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { BoardType, useListItemStore } from "@/lib/stores/list-item-store";
import { cn } from "@/lib/utils";
import type { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";
import { useTranslations } from "next-intl";
import { RxCheck, RxPlusCircled } from "react-icons/rx";

interface TagOption {
  id: string;
  name: string;
  count: number;
}

interface TagFilterProps {
  threads: GetApiByGuildIdBoardByBoardType200Item[];
  boardType: BoardType;
}

export function TagFilter({ threads, boardType }: TagFilterProps) {
  const listItemsStore = useListItemStore(boardType);
  const t = useTranslations();

  const tagOptions: TagOption[] = threads.reduce((acc, thread) => {
    thread.tags.forEach((tag) => {
      const existing = acc.find((t) => t.id === tag.id);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ id: tag.id, name: tag.name, count: 1 });
      }
    });
    return acc;
  }, [] as TagOption[]);

  tagOptions.sort((a, b) => b.count - a.count);

  const selectedSet = new Set(listItemsStore.selectedTags);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-9 border-dashed">
            <RxPlusCircled className="mr-2 h-4 w-4" />
            {t("SHOWCASE.FILTER.TAGS")}
            {listItemsStore.selectedTags.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {listItemsStore.selectedTags.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {listItemsStore.selectedTags.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {listItemsStore.selectedTags.length}{" "}
                      {t("SHOWCASE.FILTER.SELECTED")}
                    </Badge>
                  ) : (
                    tagOptions
                      .filter((option) => selectedSet.has(option.id))
                      .map((option) => (
                        <Badge
                          variant="secondary"
                          key={option.id}
                          className="rounded-sm px-1 font-normal"
                        >
                          {option.name}
                        </Badge>
                      ))
                  )}
                </div>
              </>
            )}
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={t("SHOWCASE.FILTER.SEARCH_TAGS")} />
          <CommandList>
            <CommandEmpty>{t("SHOWCASE.FILTER.NO_TAGS_FOUND")}</CommandEmpty>
            <CommandGroup>
              {tagOptions.map((option) => {
                const isSelected = selectedSet.has(option.id);
                return (
                  <CommandItem
                    key={option.id}
                    onSelect={() => {
                      const newSelectedTags = isSelected
                        ? listItemsStore.selectedTags.filter(
                            (id) => id !== option.id,
                          )
                        : [...listItemsStore.selectedTags, option.id];
                      listItemsStore.setSelectedTags(newSelectedTags);
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <RxCheck className="h-4 w-4" />
                    </div>
                    <span className="flex-1">{option.name}</span>
                    <span className="ml-auto flex min-w-8 items-center justify-end font-mono text-xs">
                      {option.count}
                    </span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {listItemsStore.selectedTags.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => listItemsStore.setSelectedTags([])}
                    className="justify-center text-center"
                  >
                    {t("SHOWCASE.FILTER.CLEAR_FILTERS")}
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
