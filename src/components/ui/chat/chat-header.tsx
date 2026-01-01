"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export function ChatHeader({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-background sticky top-0 z-10 flex items-center gap-4 p-2",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function ChatHeaderStart({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatHeaderMain({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-1 items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function ChatHeaderEnd({
  children,
  className,
  ...props
}: { children?: React.ReactNode } & React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}
