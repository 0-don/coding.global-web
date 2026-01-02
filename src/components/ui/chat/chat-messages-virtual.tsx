"use client";

import { cn } from "@/lib/utils";
import { useVirtualizer } from "@tanstack/react-virtual";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
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
  // Data
  items: T[];
  getItemKey: (item: T, index: number) => string;

  // Rendering
  renderItem: (props: ChatMessagesVirtualRenderProps<T>) => ReactNode;
  estimateSize?: number;
  overscan?: number;

  // Infinite scroll
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  loadMoreThreshold?: number;

  // Auto-scroll
  enableAutoScroll?: boolean;

  // Grouping
  shouldGroup?: (current: T, previous: T) => boolean;

  // Styling
  className?: string;
  renderLoader?: () => ReactNode;
}

export interface ChatMessagesVirtualRef {
  scrollToBottom: (behavior?: "smooth" | "auto") => void;
  scrollToIndex: (index: number) => void;
  isAtBottom: () => boolean;
}

function ChatMessagesVirtualInner<T>(
  props: ChatMessagesVirtualProps<T>,
  ref: React.ForwardedRef<ChatMessagesVirtualRef>
) {
  const parentRef = useRef<HTMLDivElement>(null);
  const wasAtBottomRef = useRef(true);
  const previousItemCountRef = useRef(0);
  const previousScrollHeightRef = useRef(0);
  const previousNewestIdRef = useRef<string | null>(null);
  const isInitialMountRef = useRef(true);
  const lastFetchedAtRef = useRef(0);

  // Items are expected in chronological order (oldest first, newest last)
  const items = props.items;

  // eslint-disable-next-line react-hooks/incompatible-library
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => props.estimateSize ?? 80,
    overscan: props.overscan ?? 5,
  });

  const virtualItems = virtualizer.getVirtualItems();

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    scrollToBottom: (behavior: "smooth" | "auto" = "smooth") => {
      virtualizer.scrollToIndex(items.length - 1, {
        align: "end",
        behavior,
      });
    },
    scrollToIndex: (index: number) => {
      virtualizer.scrollToIndex(index, { align: "start" });
    },
    isAtBottom: () => wasAtBottomRef.current,
  }));

  // Scroll to bottom on initial mount
  useEffect(() => {
    if (isInitialMountRef.current && items.length > 0) {
      virtualizer.scrollToIndex(items.length - 1, { align: "end" });
      isInitialMountRef.current = false;
    }
  }, [items.length, virtualizer]);

  // Track scroll position
  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const scrollTop = scrollElement.scrollTop;
      const scrollHeight = scrollElement.scrollHeight;
      const clientHeight = scrollElement.clientHeight;
      const scrollBottom = scrollHeight - clientHeight - scrollTop;

      // User is "at bottom" if within 50px
      wasAtBottomRef.current = scrollBottom < 50;
    };

    scrollElement.addEventListener("scroll", handleScroll, { passive: true });
    return () => scrollElement.removeEventListener("scroll", handleScroll);
  }, []);

  // Infinite scroll: load more when near top
  useEffect(() => {
    const firstItem = virtualItems[0];
    if (!firstItem) return;

    const threshold = props.loadMoreThreshold ?? 3;
    const now = Date.now();

    // Debounce fetch requests - wait at least 1 second between fetches
    if (now - lastFetchedAtRef.current < 1000) return;

    if (
      firstItem.index <= threshold &&
      props.hasNextPage &&
      !props.isFetchingNextPage
    ) {
      lastFetchedAtRef.current = now;
      props.fetchNextPage?.();
    }
  }, [
    virtualItems,
    props.hasNextPage,
    props.fetchNextPage,
    props.isFetchingNextPage,
    props.loadMoreThreshold,
  ]);

  // Maintain scroll position when older messages are prepended
  useLayoutEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;

    const itemsWereAddedAtTop =
      items.length > previousItemCountRef.current &&
      previousItemCountRef.current > 0 &&
      !wasAtBottomRef.current;

    if (itemsWereAddedAtTop) {
      // Older messages were added at the top
      const heightDifference =
        scrollElement.scrollHeight - previousScrollHeightRef.current;
      scrollElement.scrollTop += heightDifference;
    }

    previousItemCountRef.current = items.length;
    previousScrollHeightRef.current = scrollElement.scrollHeight;
  }, [items.length]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (items.length === 0) return;

    const newestItem = items[items.length - 1];
    const newestId = props.getItemKey(newestItem, items.length - 1);

    if (
      previousNewestIdRef.current !== null &&
      previousNewestIdRef.current !== newestId
    ) {
      // New message arrived
      if (props.enableAutoScroll !== false && wasAtBottomRef.current) {
        // Wait for the virtualizer to measure the new item before scrolling
        // Use double requestAnimationFrame to ensure measurement is complete
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            virtualizer.scrollToIndex(items.length - 1, {
              align: "end",
              behavior: "smooth",
            });
          });
        });
      }
    }

    previousNewestIdRef.current = newestId;
  }, [items, props.enableAutoScroll, props.getItemKey, virtualizer]);

  // Determine if item is first in group
  const isFirstInGroup = useCallback(
    (index: number): boolean => {
      if (index === 0) return true;
      if (!props.shouldGroup) return true;
      const current = items[index];
      const previous = items[index - 1];
      return !props.shouldGroup(current, previous);
    },
    [items, props.shouldGroup]
  );

  return (
    <div
      ref={parentRef}
      className={cn("flex flex-1 flex-col overflow-auto", props.className)}
    >
      {/* Loading indicator at top */}
      {props.isFetchingNextPage && props.renderLoader && (
        <div className="flex justify-center py-2">{props.renderLoader()}</div>
      )}

      {/* Virtual container */}
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualItems.map((virtualItem) => {
          const item = items[virtualItem.index];
          const previousItem =
            virtualItem.index > 0
              ? items[virtualItem.index - 1]
              : null;

          return (
            <div
              key={props.getItemKey(item, virtualItem.index)}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              {props.renderItem({
                item,
                index: virtualItem.index,
                isFirstInGroup: isFirstInGroup(virtualItem.index),
                previousItem,
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ForwardRef with generics requires this pattern
export const ChatMessagesVirtual = forwardRef(ChatMessagesVirtualInner) as <T>(
  props: ChatMessagesVirtualProps<T> & {
    ref?: React.ForwardedRef<ChatMessagesVirtualRef>;
  }
) => ReturnType<typeof ChatMessagesVirtualInner>;
