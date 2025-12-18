"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DiscordUser, DiscordUserCard } from "./discord-user-card";
import { ReactElement } from "react";

interface DiscordUserPopoverProps {
  user: DiscordUser;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function DiscordUserPopover({
  user,
  children,
  side = "right",
  align = "start",
  sideOffset = 8,
}: DiscordUserPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger render={children} />
      <PopoverContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className="w-auto p-0"
      >
        <DiscordUserCard user={user} />
      </PopoverContent>
    </Popover>
  );
}
