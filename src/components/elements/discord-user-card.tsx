"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GetApiByGuildIdWidget200MembersItem } from "@/openapi";
import { useTranslations } from "next-intl";
import {
  LevelRole,
  MemberStatus,
  RoleBadgeIcon,
  StaffRole,
  StatusIndicator,
  StatusRole,
} from "./utils/enums";

export type DiscordUser = GetApiByGuildIdWidget200MembersItem;

interface DiscordUserCardProps {
  user: DiscordUser;
  className?: string;
  compact?: boolean;
}

export function DiscordUserCard(props: DiscordUserCardProps) {
  const t = useTranslations();

  const bannerStyle = props.user.bannerUrl
    ? { backgroundImage: `url(${props.user.bannerUrl})` }
    : props.user.banner
      ? { backgroundColor: `#${props.user.banner}` }
      : { backgroundColor: props.user.displayHexColor || "#5865F2" };

  return (
    <Card className={cn("w-80 overflow-hidden", props.className)}>
      {/* Banner */}
      {!props.compact && (
        <div className="h-24 w-full bg-cover bg-center" style={bannerStyle} />
      )}

      <CardHeader className={cn("pb-3", !props.compact && "-mt-12")}>
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar
              className={cn(
                "border-card border-4",
                props.compact ? "h-12 w-12" : "h-20 w-20",
              )}
            >
              <AvatarImage
                src={props.user.avatar}
                alt={props.user.displayName}
              />
              <AvatarFallback>
                {props.user.displayName
                  ? props.user.displayName.charAt(0).toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <StatusIndicator
              status={props.user.status as MemberStatus}
              className={cn(
                "border-4",
                props.compact
                  ? "-right-1 -bottom-1 h-4 w-4"
                  : "-right-1 -bottom-1 h-5 w-5",
              )}
            />
          </div>

          {props.compact && (
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-lg font-semibold">
                {props.user.displayName}
              </h3>
              {props.user.username && (
                <p className="text-muted-foreground truncate text-sm">
                  @{props.user.username}
                </p>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* User Info */}
        {!props.compact && (
          <div>
            <h3 className="truncate text-xl font-bold">
              {props.user.displayName}
            </h3>
            {props.user.username && (
              <p className="text-muted-foreground truncate text-sm">
                @{props.user.username}
              </p>
            )}
          </div>
        )}

        {/* Member Since */}
        {props.user.joinedAt && (
          <div className="border-t pt-3">
            <h4 className="mb-1 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.MEMBER_SINCE")}
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span>
                {new Date(props.user.joinedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Created At */}
        {props.user.createdAt && (
          <div className="border-t pt-3">
            <h4 className="mb-1 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.CREATED_AT")}
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span>
                {new Date(props.user.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        )}

        {/* Roles */}
        {props.user.roles && props.user.roles.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="mb-2 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.ROLES")}
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {props.user.roles.map((role, index) => (
                <RoleBadgeIcon
                  key={`${props.user.id}-role-${index}`}
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
  );
}
