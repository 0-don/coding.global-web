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
import { ThreadType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { GetApiByGuildIdThreadByThreadType200Item } from "@/openapi";
import { getThreadAtoms } from "@/store/thread-store";
import { useAtomValue, useSetAtom } from "jotai";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";
import { RxCheck, RxPlusCircled } from "react-icons/rx";

interface TagOption {
  id: string;
  name: string;
  count: number;
}

interface TagFilterProps {
  threads: GetApiByGuildIdThreadByThreadType200Item[];
  threadType: ThreadType;
}

export function TagFilter({ threads, threadType }: TagFilterProps) {
  const atoms = getThreadAtoms(threadType);
  const selectedTags = useAtomValue(atoms.selectedTagsAtom);
  const setSelectedTags = useSetAtom(atoms.selectedTagsAtom);
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

  const selectedSet = new Set(selectedTags);

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-8 border-dashed md:h-9"
          >
            <RxPlusCircled className="mr-1.5 h-4 w-4 md:mr-2" />
            <span className="hidden sm:inline">
              {t("SHOWCASE.FILTER.TAGS")}
            </span>
            <span className="sm:hidden">{t("SHOWCASE.FILTER.TAGS")}</span>
            {selectedTags.length > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-1.5 h-4 md:mx-2"
                />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedTags.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedTags.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedTags.length} {t("SHOWCASE.FILTER.SELECTED")}
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
                        ? selectedTags.filter((id) => id !== option.id)
                        : [...selectedTags, option.id];
                      posthog.capture("tag_filter_changed", {
                        board_type: threadType,
                        tag_name: option.name,
                        action: isSelected ? "removed" : "added",
                        tags_count: newSelectedTags.length,
                      });
                      setSelectedTags(newSelectedTags);
                    }}
                    className="[&>svg]:hidden"
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <RxCheck className="h-4 w-4" />
                    </div>
                    <div className="flex flex-1 items-center justify-between">
                      <span className="truncate">{option.name}</span>
                      <span className="font-mono text-xs">{option.count}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedTags.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      posthog.capture("tag_filter_cleared", {
                        board_type: threadType,
                      });
                      setSelectedTags([]);
                    }}
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
