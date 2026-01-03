"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef, type ReactNode } from "react";
import { Virtualizer, type VirtualizerHandle } from "virtua";

interface ChatMessagesVirtualRenderProps<T> {
  item: T;
  index: number;
  previousItem: T | null;
}

interface ChatMessagesVirtualProps<T> {
  items: T[];
  getItemKey: (item: T, index: number) => number;
  renderItem: (props: ChatMessagesVirtualRenderProps<T>) => ReactNode;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  fetchNextPage?: () => void;
  className?: string;
  renderLoader?: () => ReactNode;
  ref?: React.RefObject<VirtualizerHandle>;
}

export function ChatMessagesVirtual<T>(props: ChatMessagesVirtualProps<T>) {
  const { ref, ...restProps } = props;
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef<VirtualizerHandle>(null);
  const lastFetchRef = useRef(0);
  const prevLengthRef = useRef(restProps.items.length);
  const isInitialMount = useRef(true);

  // Scroll to bottom on initial mount
  useEffect(() => {
    if (isInitialMount.current && restProps.items.length > 0) {
      // Use requestAnimationFrame to ensure Virtualizer has rendered
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          virtualRef.current?.scrollToIndex(restProps.items.length - 1, {
            align: "end",
            smooth: false,
          });
          isInitialMount.current = false;
        });
      });
    }
  }, [restProps.items.length]);

  // Auto-scroll to bottom when new messages are appended (not prepended)
  useEffect(() => {
    const newLength = restProps.items.length;
    const prevLength = prevLengthRef.current;

    // Only auto-scroll if items were added at the end (new messages)
    // Not when prepending older messages (which adds to the beginning)
    if (newLength > prevLength && !isInitialMount.current) {
      const scrollEl = scrollRef.current;
      if (scrollEl) {
        const distanceFromBottom =
          scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
        // Only auto-scroll if user is near bottom
        if (distanceFromBottom < 100) {
          virtualRef.current?.scrollToIndex(newLength - 1, { align: "end" });
        }
      }
    }
    prevLengthRef.current = newLength;
  }, [restProps.items.length]);

  const handleScroll = (offset: number) => {
    // Fetch more when near top (older messages)
    if (offset < 200 && restProps.hasNextPage && !restProps.isFetchingNextPage) {
      const now = Date.now();
      if (now - lastFetchRef.current > 1000) {
        lastFetchRef.current = now;
        restProps.fetchNextPage?.();
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn("flex-1 overflow-auto", restProps.className)}
    >
      <Virtualizer
        ref={ref ?? virtualRef}
        scrollRef={scrollRef}
        shift
        onScroll={handleScroll}
      >
        {restProps.isFetchingNextPage && restProps.renderLoader && (
          <div className="flex justify-center py-2">
            {restProps.renderLoader()}
          </div>
        )}
        {restProps.items.map((item, index) => (
          <div key={restProps.getItemKey(item, index)}>
            {restProps.renderItem({
              item,
              index,
              previousItem: restProps.items[index - 1] ?? null,
            })}
          </div>
        ))}
      </Virtualizer>
    </div>
  );
}
