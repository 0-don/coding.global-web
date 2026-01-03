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
  const scrollRef = useRef<HTMLDivElement>(null);
  const virtualRef = useRef<VirtualizerHandle>(null);
  const lastFetchRef = useRef(0);
  const prevLengthRef = useRef(props.items.length);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current && props.items.length > 0) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          virtualRef.current?.scrollToIndex(props.items.length - 1, {
            align: "end",
            smooth: false,
          });
          isInitialMount.current = false;
        });
      });
    }
  }, [props.items.length]);

  useEffect(() => {
    const newLength = props.items.length;
    if (newLength > prevLengthRef.current && !isInitialMount.current) {
      const scrollEl = scrollRef.current;
      if (scrollEl) {
        const distanceFromBottom =
          scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
        if (distanceFromBottom < 100) {
          virtualRef.current?.scrollToIndex(newLength - 1, { align: "end" });
        }
      }
    }
    prevLengthRef.current = newLength;
  }, [props.items.length]);

  const handleScroll = (offset: number) => {
    if (offset < 200 && props.hasNextPage && !props.isFetchingNextPage) {
      const now = Date.now();
      if (now - lastFetchRef.current > 1000) {
        lastFetchRef.current = now;
        props.fetchNextPage?.();
      }
    }
  };

  return (
    <div
      ref={scrollRef}
      className={cn("flex-1 overflow-auto", props.className)}
    >
      {props.isFetchingNextPage && props.renderLoader && (
        <div className="flex justify-center py-4">{props.renderLoader()}</div>
      )}
      <Virtualizer
        ref={props.ref ?? virtualRef}
        scrollRef={scrollRef}
        shift
        onScroll={handleScroll}
      >
        {/* eslint-disable-next-line react-hooks/rules-of-hooks */}
        {props.items.map((item, index) => (
          <div key={props.getItemKey(item, index)}>
            {props.renderItem({
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
