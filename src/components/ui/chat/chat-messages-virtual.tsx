"use client";

import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
} from "react";

interface ChatMessagesVirtualRenderProps<T> {
  item: T;
  index: number;
  isFirstInGroup: boolean;
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
  shouldGroup?: (current: T, previous: T) => boolean;
  className?: string;
  renderLoader?: () => ReactNode;
}

export interface ChatMessagesVirtualRef {
  scrollToBottom: (behavior?: "smooth" | "auto") => void;
  isAtBottom: () => boolean;
}

function ChatMessagesVirtualInner<T>(
  props: ChatMessagesVirtualProps<T>,
  ref: React.ForwardedRef<ChatMessagesVirtualRef>,
) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const atBottomRef = useRef(true);
  const lastFetchRef = useRef(0);

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: props.items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => props.estimateSize ?? 80,
    overscan: props.overscan ?? 5,
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
        lastVisible.index >= props.items.length - 5 &&
        props.hasNextPage &&
        !props.isFetchingNextPage
      ) {
        lastFetchRef.current = now;
        props.fetchNextPage?.();
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
  }, [virtualItems, props.items.length, props.hasNextPage, props.isFetchingNextPage, props.fetchNextPage]);

  // In newest-first: index+1 is the older (previous) message
  const isFirstInGroup = useCallback(
    (index: number): boolean => {
      if (index + 1 >= props.items.length || !props.shouldGroup) return true;
      return !props.shouldGroup(props.items[index], props.items[index + 1]);
    },
    [props.items, props.shouldGroup],
  );

  return (
    <div
      ref={scrollRef}
      className={cn("flex flex-1 flex-col overflow-auto", props.className)}
      style={{ transform: "scaleY(-1)" }}
    >
      {props.isFetchingNextPage && props.renderLoader && (
        <div className="flex justify-center py-2" style={{ transform: "scaleY(-1)" }}>
          {props.renderLoader()}
        </div>
      )}

      <div style={{ height: virtualizer.getTotalSize(), width: "100%", position: "relative" }}>
        {virtualItems.map((vItem) => (
          <div
            key={props.getItemKey(props.items[vItem.index], vItem.index)}
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
            {props.renderItem({
              item: props.items[vItem.index],
              index: vItem.index,
              isFirstInGroup: isFirstInGroup(vItem.index),
              previousItem: props.items[vItem.index + 1] ?? null,
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export const ChatMessagesVirtual = forwardRef(ChatMessagesVirtualInner) as <T>(
  props: ChatMessagesVirtualProps<T> & { ref?: React.ForwardedRef<ChatMessagesVirtualRef> },
) => ReturnType<typeof ChatMessagesVirtualInner>;
