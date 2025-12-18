"use client";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";
import { DiscordUser, DiscordUserCard } from "./discord-user-card";

interface DiscordUserPopoverProps {
  user: DiscordUser;
  children: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  openDelay?: number;
  closeDelay?: number;
}

export function DiscordUserPopover({
  user,
  children,
  side = "right",
  align = "start",
  sideOffset = 8,
  openDelay = 300,
  closeDelay = 200,
}: DiscordUserPopoverProps) {
  return (
    <HoverCard>
      <HoverCardTrigger delay={openDelay} closeDelay={closeDelay}>
        {children}
      </HoverCardTrigger>
      <HoverCardContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-auto p-0"
      >
        <DiscordUserCard user={user} />
      </HoverCardContent>
    </HoverCard>
  );
}
