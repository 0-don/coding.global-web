"use client";

import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";

interface ChatMessagesVirtualRenderProps<T> {
  item: T;
  index: number;
  previousItem: T | null;
}

interface ChatMessagesVirtualProps<T> {
  items: T[]; // Newest-first order
  getItemKey: (item: T, index: number) => string;
  renderItem: (props: ChatMessagesVirtualRenderProps<T>) => ReactNode;
  estimateSize?: number;
  overscan?: number;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  renderLoader?: () => ReactNode;
  ref?: React.RefObject<ChatMessagesVirtualRef>;
}

export interface ChatMessagesVirtualRef {
  scrollToBottom: (behavior?: "smooth" | "auto") => void;
  isAtBottom: () => boolean;
}

export function ChatMessagesVirtual<T>(props: ChatMessagesVirtualProps<T>) {
  const { ref, ...restProps } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const lastFetchRef = useRef(0);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: restProps.items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => restProps.estimateSize ?? 80,
    overscan: restProps.overscan ?? 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior: "smooth" | "auto" = "smooth") => {
      scrollRef.current?.scrollTo({ top: 0, behavior });
    },
    isAtBottom: () => atBottomRef.current,
  }));

  // Track scroll + invert wheel + infinite scroll
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      atBottomRef.current = el.scrollTop < 50;

      // Fetch more when viewing old messages (high index in newest-first array)
      const lastVisible = virtualItems[virtualItems.length - 1];
      if (!lastVisible) return;

      const now = Date.now();
      if (now - lastFetchRef.current < 1000) return;

      if (
        lastVisible.index >= restProps.items.length - 5 &&
        restProps.hasNextPage &&
        !restProps.isFetchingNextPage
      ) {
        lastFetchRef.current = now;
        restProps.fetchNextPage?.();
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      el.scrollTop -= e.deltaY;
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("scroll", onScroll);
      el.removeEventListener("wheel", onWheel);
    };
  }, [virtualItems, restProps.items.length, restProps.hasNextPage, restProps.isFetchingNextPage, restProps.fetchNextPage]);


  return (
    <div
      ref={scrollRef}
      className={cn("flex flex-1 flex-col overflow-auto", restProps.className)}
      style={{ transform: "scaleY(-1)" }}
    >
      {restProps.isFetchingNextPage && restProps.renderLoader && (
        <div className="flex justify-center py-2" style={{ transform: "scaleY(-1)" }}>
          {restProps.renderLoader()}
        </div>
      )}

      <div style={{ height: virtualizer.getTotalSize(), width: "100%", position: "relative" }}>
        {virtualItems.map((vItem) => {
          const item = restProps.items[vItem.index];
          if (!item) return null;

          return (
            <div
              key={restProps.getItemKey(item, vItem.index)}
              data-index={vItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${vItem.start}px) scaleY(-1)`,
              }}
            >
              {restProps.renderItem({
                item,
                index: vItem.index,
                previousItem: restProps.items[vItem.index + 1] ?? null,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
