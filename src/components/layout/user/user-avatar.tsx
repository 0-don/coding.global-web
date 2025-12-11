"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionHook } from "@/hook/session-hook";

import { cn } from "@/lib/utils";

interface UserAvatarProps {
  className?: string;
  showName?: boolean;
  namePosition?: "right" | "bottom";
}

export function UserAvatar({
  className = "h-8 w-8",
  showName = false,
  namePosition = "right",
}: UserAvatarProps) {
  const session = useSessionHook();

  if (!session?.data?.user.id) {
    return null;
  }

  const username = session.data.user.name || "";
  const name = username?.split("@")[0] || "";
  const firstEmailChar = name.charAt(0).toUpperCase();

  const avatar = (
    <Avatar className={cn(`rounded-lg`, className)}>
      <AvatarImage
        src={session.data.user.image || ""}
        alt={session?.data?.user.name || ""}
      />
      <AvatarFallback className="rounded-lg">{firstEmailChar}</AvatarFallback>
    </Avatar>
  );

  if (!showName) {
    return avatar;
  }

  return (
    <div
      className={cn(
        `flex items-center gap-2`,
        namePosition === "bottom" ? "flex-col" : "flex-row",
      )}
    >
      {avatar}
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{name}</span>
        <span className="text-muted-foreground truncate text-xs">
          {username}
        </span>
      </div>
    </div>
  );
}
