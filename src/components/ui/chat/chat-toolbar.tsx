"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SendIcon } from "lucide-react";
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
        className={cn("relative flex items-end rounded-md border px-3 py-2")}
      >
        {children}
      </div>
    </div>
  );
}

export function ChatToolbarTextarea({
  className,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  return (
    <Textarea
      id="toolbar-input"
      placeholder="Type your message..."
      className={cn(
        "h-fit max-h-30 min-h-10 flex-1 pr-10 @md/chat:text-base",
        "resize-none border-none shadow-none placeholder:whitespace-nowrap focus-visible:border-none focus-visible:ring-0",
        className,
      )}
      rows={1}
      {...props}
    />
  );
}

export function ChatToolbarSendButton({
  className,
  ...props
}: React.ComponentProps<typeof Button>) {
  return (
    <Button
      size="icon"
      className={cn(
        "absolute right-4 bottom-2.5 size-7 shrink-0 rounded-full",
        className,
      )}
      {...props}
    >
      <SendIcon className="size-4" />
    </Button>
  );
}
