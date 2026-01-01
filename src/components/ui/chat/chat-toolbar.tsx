"use client";

import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import * as React from "react";

export function ChatToolbar({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn("bg-background sticky bottom-0 p-2 pt-0", className)}
      {...props}
    >
      <div
        className={cn(
          "rounded-md border px-3 py-2",
          "grid grid-cols-[max-content_auto_max-content] gap-x-2",
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ChatToolbarAddonStart({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-1 row-start-1 flex h-10 items-center gap-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatToolbarTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <div className="row-span-2 grid flex-1">
      <Textarea
        id="toolbar-input"
        placeholder="Type your message..."
        className={cn(
          "h-fit max-h-30 min-h-10 px-1 @md/chat:text-base",
          "resize-none border-none shadow-none placeholder:whitespace-nowrap focus-visible:border-none focus-visible:ring-0",
          className,
        )}
        rows={1}
        {...props}
      />
    </div>
  );
}

export function ChatToolbarAddonEnd({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "col-start-3 row-start-1 flex h-10 items-center gap-1 @md/chat:gap-1.5",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
