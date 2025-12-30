"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSearch } from "@/hook/use-search";
import { Link } from "@/i18n/navigation";
import { LinkHref } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

export function SidebarSearch() {
  const t = useTranslations();
  const { query, setQuery, results, isLoading, isIndexLoaded } = useSearch();
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground relative justify-start gap-2 pr-12 text-sm font-normal"
          >
            <Search className="size-4" />
            <span>{t("MAIN.SIDEBAR.SEARCH.PLACEHOLDER")}</span>
            <kbd className="bg-muted text-muted-foreground pointer-events-none absolute right-2 hidden h-5 items-center gap-1 rounded border px-1.5 font-mono text-xs font-medium opacity-100 select-none sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        }
      ></PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
        sideOffset={4}
      >
        <div className="flex flex-col">
          <div className="border-b p-2">
            <div className="flex items-center gap-2">
              <Search className="text-muted-foreground size-4" />
              <input
                ref={inputRef}
                type="text"
                placeholder={t("MAIN.SIDEBAR.SEARCH.PLACEHOLDER")}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
          <div className="max-h-75 overflow-y-auto">
            {!isIndexLoaded && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                {t("MAIN.SIDEBAR.SEARCH.LOADING")}
              </div>
            )}
            {isIndexLoaded && !query && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                {t("MAIN.SIDEBAR.SEARCH.START_TYPING")}
              </div>
            )}
            {isIndexLoaded && query && results.length === 0 && !isLoading && (
              <div className="text-muted-foreground p-4 text-center text-sm">
                {t("MAIN.SIDEBAR.SEARCH.NO_RESULTS")}
              </div>
            )}
            {results.length > 0 && (
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={result.url}
                    href={result.url as LinkHref}
                    onClick={handleSelect}
                    className={cn(
                      "hover:bg-accent flex flex-col gap-1 rounded-md p-2 text-sm",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{result.title}</span>
                      <span className="text-muted-foreground text-xs">
                        {result.category}
                      </span>
                    </div>
                    <span className="text-muted-foreground line-clamp-1 text-xs">
                      {result.description}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
