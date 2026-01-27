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
import { GetApiByGuildIdNews200ItemAuthor } from "@/openapi";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ReactNode } from "react";
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
  user: GetApiByGuildIdNews200ItemAuthor;
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function DiscordUserPopover(props: DiscordUserPopoverProps) {
  const t = useTranslations();
  const session = useSessionHook();

  const isCurrentUser = session.data?.user?.discordId === props.user.id;

  const bannerStyle = props.user.bannerUrl
    ? { backgroundImage: `url(${props.user.bannerUrl})` }
    : { backgroundColor: props.user.displayHexColor || "#5865F2" };

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(props.user.username);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USERNAME_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(props.user.id);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USER_ID_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  return (
    <Popover open={props.open} onOpenChange={props.onOpenChange}>
      <PopoverTrigger render={<span />}>{props.children}</PopoverTrigger>
      <PopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        className="w-auto p-0"
      >
        <Card className={cn("w-80 overflow-hidden pt-0")}>
          {/* Banner */}
          <div className="h-24 w-full bg-cover bg-center" style={bannerStyle} />

          <CardHeader className="-mt-12">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="border-card h-20 w-20 border-4">
                  <AvatarImage
                    src={props.user.avatarUrl}
                    alt={props.user.username}
                  />
                  <AvatarFallback>
                    {props.user.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <StatusIndicator
                  status={props.user.status as MemberStatus}
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
                  {props.user.displayName}
                  {isCurrentUser && (
                    <Badge className="ml-2">
                      {t("DISCORD_WIDGET.USER_CARD.YOU")}
                    </Badge>
                  )}
                </h5>
                {props.user.premiumSince && (
                  <IoDiamondSharp
                    className="h-4 w-4 shrink-0"
                    style={{
                      color: "#FF73FA",
                      filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                    }}
                    title={t("DISCORD_WIDGET.USER_CARD.NITRO_SINCE", {
                      date: dayjs(props.user.premiumSince).format(
                        "MMMM D, YYYY",
                      ),
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
                  {props.user.username}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={copyUserId}
                    className="text-muted-foreground hover:text-foreground cursor-pointer text-left text-xs transition-colors"
                    type="button"
                  >
                    {props.user.id}
                  </button>

                  <Link
                    href={getDiscordUserLink(props.user.id)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 flex items-center gap-1 text-xs transition-colors"
                    title={t("DISCORD_WIDGET.USER_CARD.OPEN_IN_DISCORD")}
                  >
                    {t("DISCORD_WIDGET.USER_CARD.CONTACT_ME")}
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M19 19H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex border-t pt-3">
              {/* Created At */}
              {props.user.createdAt && (
                <div className="w-full">
                  <h4 className="mb-1 text-xs font-semibold uppercase">
                    {t("DISCORD_WIDGET.USER_CARD.CREATED_AT")}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span>
                      {dayjs(props.user.createdAt).format("MMMM D, YYYY")}
                    </span>
                  </div>
                </div>
              )}

              {/* Member Since */}
              {props.user.joinedAt && (
                <div className="w-full">
                  <h4 className="mb-1 text-xs font-semibold uppercase">
                    {t("DISCORD_WIDGET.USER_CARD.MEMBER_SINCE")}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span>
                      {dayjs(props.user.joinedAt).format("MMMM D, YYYY")}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Roles */}
            {props.user.roles && props.user.roles.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="mb-2 text-xs font-semibold uppercase">
                  {t("DISCORD_WIDGET.USER_CARD.ROLES")}
                </h4>
                <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                  {props.user.roles.map((role) => (
                    <RoleBadgeIcon
                      key={role.name}
                      role={role.name as StaffRole | StatusRole | LevelRole}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Activity */}
            {props.user.activity && (
              <div className="border-t pt-3">
                <h4 className="mb-1 text-xs font-semibold uppercase">
                  {t("DISCORD_WIDGET.USER_CARD.ACTIVITY")}
                </h4>
                <p className="text-sm">{props.user.activity}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
