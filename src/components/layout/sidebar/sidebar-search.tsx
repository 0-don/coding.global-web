"use client";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hook/use-search";
import { Link } from "@/i18n/navigation";
import type { LinkHref } from "@/i18n/routing";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function SidebarSearch() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const { results, isLoading, isIndexLoaded } = useSearch(query);
  const [open, setOpen] = useState(false);

  const handleSelect = () => {
    setOpen(false);
    setQuery("");
  };

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="text-muted-foreground relative justify-start gap-2 pr-12 text-sm font-normal"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span>{t("MAIN.SIDEBAR.SEARCH.PLACEHOLDER")}</span>
        <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title={t("MAIN.SIDEBAR.SEARCH.PLACEHOLDER")}
        description={t("MAIN.SIDEBAR.SEARCH.START_TYPING")}
        className="max-w-md"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t("MAIN.SIDEBAR.SEARCH.PLACEHOLDER")}
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {!isIndexLoaded && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                {t("MAIN.SIDEBAR.SEARCH.LOADING")}
              </div>
            )}
            {isIndexLoaded && query && results.length === 0 && !isLoading && (
              <CommandEmpty>{t("MAIN.SIDEBAR.SEARCH.NO_RESULTS")}</CommandEmpty>
            )}
            {results.length > 0 && (
              <CommandGroup>
                {results.map((result) => (
                  <Link
                    key={result.url}
                    href={result.url as LinkHref}
                    onClick={handleSelect}
                  >
                    <CommandItem
                      value={result.url}
                      className="flex flex-col items-start gap-1"
                    >
                      <div className="flex w-full items-center justify-between gap-2">
                        <span className="truncate font-medium">
                          {result.title}
                        </span>
                        <span className="text-muted-foreground shrink-0 text-xs">
                          {result.category}
                        </span>
                      </div>
                      <span className="text-muted-foreground line-clamp-1 text-xs">
                        {result.description}
                      </span>
                    </CommandItem>
                  </Link>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
