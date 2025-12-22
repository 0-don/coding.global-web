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
import { useListItemsStore } from "@/lib/stores/list-item-store";
import { cn } from "@/lib/utils";
import type { GetApiByGuildIdBoardByBoardType200Item } from "@/openapi";
import { RxCheck, RxPlusCircled } from "react-icons/rx";

interface TagOption {
  id: string;
  name: string;
  count: number;
}

interface TagFilterProps {
  threads: GetApiByGuildIdBoardByBoardType200Item[];
}

export function TagFilter({ threads }: TagFilterProps) {
  const { selectedTags, setSelectedTags } = useListItemsStore();

  // Get unique tags with counts
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

  // Sort by count descending
  tagOptions.sort((a, b) => b.count - a.count);

  const selectedSet = new Set(selectedTags);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 border-dashed">
          <RxPlusCircled className="mr-2 h-4 w-4" />
          Tags
          {selectedTags.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
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
                    {selectedTags.length} selected
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
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search tags..." />
          <CommandList>
            <CommandEmpty>No tags found.</CommandEmpty>
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
                      setSelectedTags(newSelectedTags);
                    }}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
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
            {selectedTags.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => setSelectedTags([])}
                    className="justify-center text-center"
                  >
                    Clear filters
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
