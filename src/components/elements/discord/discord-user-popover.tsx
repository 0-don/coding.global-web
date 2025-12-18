"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactElement } from "react";
import { DiscordUser, DiscordUserCard } from "./discord-user-card";

interface DiscordUserPopoverProps {
  user: DiscordUser;
  children: ReactElement;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
}

export function DiscordUserPopover(props: DiscordUserPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger render={props.children} nativeButton={false} />
      <PopoverContent
        side={props.side}
        align={props.align}
        sideOffset={props.sideOffset}
        className="w-auto p-0"
      >
        <DiscordUserCard user={props.user} />
      </PopoverContent>
    </Popover>
  );
}
