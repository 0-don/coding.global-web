"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { GetApiByGuildIdWidget200MembersItem } from "@/openapi";
import { useTranslations } from "next-intl";
import dayjs from "dayjs";
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
}

export function DiscordUserCard(props: DiscordUserCardProps) {
  const t = useTranslations();

  const bannerStyle = props.user.bannerUrl
    ? { backgroundImage: `url(${props.user.bannerUrl})` }
    : props.user.bannerUrl
      ? { backgroundColor: `#${props.user.bannerUrl}` }
      : { backgroundColor: props.user.displayHexColor || "#5865F2" };

  return (
    <Card className={cn("w-80 overflow-hidden", props.className)}>
      {/* Banner */}
      <div className="h-24 w-full bg-cover bg-center" style={bannerStyle} />

      <CardHeader className="pb-3 -mt-12">
        <div className="flex items-start gap-3">
          <div className="relative">
            <Avatar className="border-card border-4 h-20 w-20">
              <AvatarImage
                src={props.user.displayAvatarURL}
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
              className="border-4 -right-1 -bottom-1 h-5 w-5"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pb-4">
        {/* User Info */}
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

        {/* Member Since */}
        {props.user.joinedAt && (
          <div className="border-t pt-3">
            <h4 className="mb-1 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.MEMBER_SINCE")}
            </h4>
            <div className="flex items-center gap-2 text-sm">
              <span>{dayjs(props.user.joinedAt).format("MMMM D, YYYY")}</span>
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
              <span>{dayjs(props.user.createdAt).format("MMMM D, YYYY")}</span>
            </div>
          </div>
        )}

        {/* Roles */}
        {props.user.roles && props.user.roles.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="mb-2 text-xs font-semibold uppercase">
              {t("DISCORD_WIDGET.USER_CARD.ROLES")}
            </h4>
            <div className="max-h-32 overflow-y-auto flex flex-wrap gap-1.5">
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
