"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSessionHook } from "@/hook/session-hook";
import { cn } from "@/lib/utils";
import { getDiscordUserLink } from "@/lib/utils/base";
import { dayjs } from "@/lib/utils/dayjs";
import { GetApiByGuildIdNews200ItemMentionsUsersItem } from "@/openapi";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";
import { FiExternalLink } from "react-icons/fi";
import { IoDiamondSharp } from "react-icons/io5";
import { toast } from "sonner";
import {
  LevelRole,
  MemberStatus,
  RoleBadgeIcon,
  StaffRole,
  StatusIndicator,
  StatusRole,
} from "../utils/enums";

interface DiscordUserPopoverProps {
  user: GetApiByGuildIdNews200ItemMentionsUsersItem;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** When provided, renders directly at this position instead of using Popover */
  anchorRect?: DOMRect;
}

function UserCardContent({ user }: { user: GetApiByGuildIdNews200ItemMentionsUsersItem }) {
  const t = useTranslations();
  const session = useSessionHook();
  const isCurrentUser = session.data?.user?.discordId === user.id;

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(user.username);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USERNAME_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(user.id);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USER_ID_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  const bannerStyle = user.bannerUrl
    ? { backgroundImage: `url(${user.bannerUrl})` }
    : { backgroundColor: user.displayHexColor || "#5865F2" };

  return (
    <Card className={cn("w-80 overflow-hidden pt-0")}>
      {/* Banner */}
      <div className="h-24 w-full bg-cover bg-center" style={bannerStyle} />

      <CardHeader className="-mt-12">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="border-card h-20 w-20 border-4">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <StatusIndicator
              status={user.status as MemberStatus}
              className="-right-1 -bottom-1 h-5 w-5 border-4"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="-mt-6 space-y-3 pb-4">
        {/* User Info */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h5 className="truncate text-xl font-bold">
              {user.displayName}
              {isCurrentUser && (
                <Badge className="ml-2">
                  {t("DISCORD_WIDGET.USER_CARD.YOU")}
                </Badge>
              )}
            </h5>
            {user.premiumSince && (
              <IoDiamondSharp
                className="h-4 w-4 shrink-0"
                style={{
                  color: "#FF73FA",
                  filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                }}
                title={t("DISCORD_WIDGET.USER_CARD.NITRO_SINCE", {
                  date: dayjs(user.premiumSince).format("MMMM D, YYYY"),
                })}
              />
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
            <button
              onClick={copyUsername}
              className="text-muted-foreground hover:text-foreground cursor-pointer text-left text-sm transition-colors"
              type="button"
            >
              {user.username}
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={copyUserId}
                className="text-muted-foreground hover:text-foreground cursor-pointer text-left text-xs transition-colors"
                type="button"
              >
                {user.id}
              </button>

              <Link
                href={getDiscordUserLink(user.id)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-colors"
                title={t("DISCORD_WIDGET.USER_CARD.OPEN_IN_DISCORD")}
              >
                {t("DISCORD_WIDGET.USER_CARD.CONTACT_ME")}
                <FiExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>

        <div className="flex border-t pt-3">
          {/* Created At */}
          {user.createdAt && (
            <div className="w-full">
              <h4 className="mb-1 text-xs font-semibold uppercase">
                {t("DISCORD_WIDGET.USER_CARD.CREATED_AT")}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span>{dayjs(user.createdAt).format("MMMM D, YYYY")}</span>
              </div>
            </div>
          )}

          {/* Member Since */}
          {user.joinedAt && (
            <div className="w-full">
              <h4 className="mb-1 text-xs font-semibold uppercase">
                {t("DISCORD_WIDGET.USER_CARD.MEMBER_SINCE")}
              </h4>
              <div className="flex items-center gap-2 text-xs">
                <span>{dayjs(user.joinedAt).format("MMMM D, YYYY")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Roles */}
        {user.roles && user.roles.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="mb-2 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.ROLES")}
            </h4>
            <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
              {user.roles.map((role) => (
                <RoleBadgeIcon
                  key={role.name}
                  role={role.name as StaffRole | StatusRole | LevelRole}
                />
              ))}
            </div>
          </div>
        )}

        {/* Activity */}
        {user.activity && (
          <div className="border-t pt-3">
            <h4 className="mb-1 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.ACTIVITY")}
            </h4>
            <p className="text-sm">{user.activity}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function DiscordUserPopover(props: DiscordUserPopoverProps) {
  // When anchorRect is provided, render at fixed position
  if (props.anchorRect) {
    return (
      <div
        data-slot="popover-content"
        style={{
          position: "fixed",
          left: props.anchorRect.left,
          top: props.anchorRect.bottom + 8,
          zIndex: 50,
        }}
      >
        <UserCardContent user={props.user} />
      </div>
    );
  }

  // Default: use Radix Popover with children as trigger
  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger nativeButton={false}>{props.children}</PopoverTrigger>
      <PopoverContent side="bottom" align="start" sideOffset={8} className="w-auto p-0">
        <UserCardContent user={props.user} />
      </PopoverContent>
    </Popover>
  );
}
