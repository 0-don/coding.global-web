"use client";

import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, type ReactNode } from "react";
import { Virtualizer, type VirtualizerHandle } from "virtua";

interface ChatMessagesVirtualProps<T> {
  items: T[];
  itemKey: keyof T;
  children: (props: {
    item: T;
    index: number;
    previousItem: T | null;
  }) => ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
}

export function ChatMessagesVirtual<T>(props: ChatMessagesVirtualProps<T>) {
  const t = useTranslations();
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef<VirtualizerHandle>(null);
  const lastFetchRef = useRef(0);
  const prevLengthRef = useRef(props.items.length);
  const isInitialMount = useRef(true);

  useEffect(() => {
    const length = props.items.length;

    if (isInitialMount.current && length > 0) {
      requestAnimationFrame(() => {
        virtualRef.current?.scrollToIndex(length - 1, {
          align: "end",
          smooth: false,
        });
        isInitialMount.current = false;
      });
      return;
    }

    if (length > prevLengthRef.current) {
      const scrollEl = scrollRef.current;
      const distanceFromBottom = scrollEl
        ? scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight
        : Infinity;

      if (distanceFromBottom < 100) {
        virtualRef.current?.scrollToIndex(length - 1, { align: "end" });
      }
    }

    prevLengthRef.current = length;
  }, [props.items.length]);

  const handleScroll = (offset: number) => {
    if (offset < 300 && props.hasNextPage && !props.isFetchingNextPage) {
      const now = Date.now();
      if (now - lastFetchRef.current > 300) {
        lastFetchRef.current = now;
        props.fetchNextPage?.();
      }
    }
  };

  return (
    <div ref={scrollRef} className={cn("flex-1 overflow-auto")}>
      {props.isFetchingNextPage && (
        <div className="flex items-center justify-center gap-2 py-4">
          <Loader2Icon className="size-4 animate-spin" />
          <span className="text-muted-foreground text-sm">
            {t("CHAT.LOADING_MESSAGES")}
          </span>
        </div>
      )}
      <Virtualizer
        ref={virtualRef}
        scrollRef={scrollRef}
        shift
        onScroll={handleScroll}
      >
        {props.items.map((item, index) => (
          <div key={String(item[props.itemKey])}>
            {props.children({
              item,
              index,
              previousItem: props.items[index - 1] ?? null,
            })}
          </div>
        ))}
      </Virtualizer>
    </div>
  );
}
