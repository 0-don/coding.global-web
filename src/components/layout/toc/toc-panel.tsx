"use client";

import { cn } from "@/lib/utils";
import {
  AnchorProvider,
  ScrollProvider,
  TOCItem,
} from "fumadocs-core/toc";
import * as React from "react";
import { useTOC } from "./toc-context";

export function TOCPanel({ className }: { className?: string }) {
  const { items, title } = useTOC();
  const containerRef = React.useRef<HTMLDivElement>(null);

  if (items.length === 0) {
    return null;
  }

  return (
    <aside
      className={cn(
        "sticky top-[calc(var(--header-height)+0.5rem)] hidden h-fit max-h-[calc(100vh-var(--header-height)-1rem)] w-56 shrink-0 overflow-hidden lg:block",
        "animate-in fade-in duration-150",
        className,
      )}
    >
      <AnchorProvider toc={items}>
        <div
          ref={containerRef}
          className="no-scrollbar flex flex-col overflow-auto"
        >
          <h3 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            {title}
          </h3>
          <ScrollProvider containerRef={containerRef}>
            <nav className="flex flex-col gap-1">
              {items.map((item) => (
                <TOCItem
                  key={item.url}
                  href={item.url}
                  className={cn(
                    "text-muted-foreground hover:text-foreground border-l-2 border-transparent py-1 text-sm transition-colors",
                    "data-[active=true]:border-primary data-[active=true]:text-primary data-[active=true]:font-medium",
                    item.depth === 2 && "pl-3",
                    item.depth === 3 && "pl-6",
                    item.depth === 4 && "pl-9",
                  )}
                >
                  {item.title}
                </TOCItem>
              ))}
            </nav>
          </ScrollProvider>
        </div>
      </AnchorProvider>
    </aside>
  );
}
