"use client";

import {
  LevelRole,
  MemberStatus,
  RoleBadgeIcon,
  StaffRole,
  StatusIndicator,
  StatusRole,
} from "@/components/elements/utils/enums";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSessionHook } from "@/hook/session-hook";
import { useTeamQuery } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";
import { GetApiByGuildIdStaff200Item } from "@/openapi";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { IoDiamondSharp } from "react-icons/io5";
import { RiTeamFill } from "react-icons/ri";
import { toast } from "sonner";

interface TeamMemberCardProps {
  member: GetApiByGuildIdStaff200Item;
}

function TeamMemberCard(props: TeamMemberCardProps) {
  const t = useTranslations();
  const session = useSessionHook();

  const isCurrentUser = session.data?.user?.discordId === props.member.id;

  const bannerStyle = props.member.bannerUrl
    ? { backgroundImage: `url(${props.member.bannerUrl})` }
    : { backgroundColor: props.member.displayHexColor || "#5865F2" };

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(props.member.username);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USERNAME_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(props.member.id);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USER_ID_COPIED"));
    } catch {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Card className="group/user relative h-full cursor-pointer overflow-hidden pt-0 transition-all hover:shadow-lg">
            {/* Banner with diagonal fade */}
            <div className="relative h-20 w-full overflow-hidden">
              <div
                className="h-full w-full bg-cover bg-center"
                style={bannerStyle}
              />
              {props.member.bannerUrl && (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${props.member.bannerUrl})`,
                    maskImage:
                      "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to bottom, black 0%, black 50%, transparent 100%)",
                  }}
                />
              )}
            </div>

            {/* Avatar overlapping banner */}
            <CardHeader className="-mt-10 pb-2">
              <div className="relative w-fit">
                <Avatar className="border-card h-16 w-16 border-4">
                  <AvatarImage
                    src={props.member.avatarUrl}
                    alt={props.member.username}
                  />
                  <AvatarFallback>
                    {props.member.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <StatusIndicator
                  status={props.member.status as MemberStatus}
                  className="-right-1 -bottom-1 h-4 w-4 border-[3px]"
                />
              </div>
            </CardHeader>

            <CardContent className="space-y-2 pt-0">
              {/* Display name */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-base font-semibold group-hover/user:underline">
                    {props.member.displayName || props.member.globalName || props.member.username}
                  </h3>
                  {isCurrentUser && (
                    <Badge className="h-4 text-[10px] shrink-0">
                      {t("DISCORD_WIDGET.USER_CARD.YOU")}
                    </Badge>
                  )}
                  {props.member.premiumSince && (
                    <IoDiamondSharp
                      className="h-3 w-3 shrink-0"
                      style={{
                        color: "#FF73FA",
                        filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                      }}
                      title={t("DISCORD_WIDGET.USER_CARD.NITRO_SINCE", {
                        date: dayjs(props.member.premiumSince).format("MMMM D, YYYY"),
                      })}
                    />
                  )}
                </div>
                <p className="text-muted-foreground truncate text-sm">
                  @{props.member.username}
                </p>
                {props.member.activity && (
                  <p className="text-muted-foreground mt-1 truncate text-xs">
                    {t("DISCORD_WIDGET.PLAYING", { activity: props.member.activity })}
                  </p>
                )}
              </div>

              {/* Primary role badge */}
              {props.member.roles.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <RoleBadgeIcon role={props.member.roles[0].name as StaffRole} />
                </div>
              )}
            </CardContent>
          </Card>
        }
        nativeButton={false}
      />

      <PopoverContent side="bottom" align="start" sideOffset={8} className="w-auto p-0">
        <Card className={cn("w-80 overflow-hidden pt-0")}>
          {/* Full banner */}
          <div className="h-24 w-full bg-cover bg-center" style={bannerStyle} />

          {/* Avatar overlapping */}
          <CardHeader className="-mt-12">
            <div className="flex items-start gap-3">
              <div className="relative">
                <Avatar className="border-card h-20 w-20 border-4">
                  <AvatarImage
                    src={props.member.avatarUrl}
                    alt={props.member.username}
                  />
                  <AvatarFallback>
                    {props.member.username.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <StatusIndicator
                  status={props.member.status as MemberStatus}
                  className="-right-1 -bottom-1 h-5 w-5 border-4"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="-mt-6 space-y-3 pb-4">
            {/* User info */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h5 className="truncate text-xl font-bold">
                  {props.member.displayName || props.member.globalName || props.member.username}
                </h5>
                {isCurrentUser && (
                  <Badge className="ml-2">
                    {t("DISCORD_WIDGET.USER_CARD.YOU")}
                  </Badge>
                )}
                {props.member.premiumSince && (
                  <IoDiamondSharp
                    className="h-4 w-4 shrink-0"
                    style={{
                      color: "#FF73FA",
                      filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                    }}
                    title={t("DISCORD_WIDGET.USER_CARD.NITRO_SINCE", {
                      date: dayjs(props.member.premiumSince).format("MMMM D, YYYY"),
                    })}
                  />
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={copyUsername}
                  className="text-muted-foreground hover:text-foreground cursor-pointer truncate text-left text-sm transition-colors"
                  type="button"
                >
                  @{props.member.username}
                </button>

                <button
                  onClick={copyUserId}
                  className="text-muted-foreground hover:text-foreground cursor-pointer truncate text-left text-xs transition-colors"
                  type="button"
                >
                  {props.member.id}
                </button>
              </div>
            </div>

            {/* Dates */}
            <div className="flex border-t pt-3">
              {props.member.createdAt && (
                <div className="w-full">
                  <h4 className="mb-1 text-xs font-semibold uppercase">
                    {t("DISCORD_WIDGET.USER_CARD.CREATED_AT")}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{dayjs(props.member.createdAt).format("MMMM D, YYYY")}</span>
                  </div>
                </div>
              )}

              {props.member.joinedAt && (
                <div className="w-full">
                  <h4 className="mb-1 text-xs font-semibold uppercase">
                    {t("DISCORD_WIDGET.USER_CARD.MEMBER_SINCE")}
                  </h4>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{dayjs(props.member.joinedAt).format("MMMM D, YYYY")}</span>
                  </div>
                </div>
              )}
            </div>

            {/* All roles */}
            {props.member.roles.length > 0 && (
              <div className="border-t pt-3">
                <h4 className="mb-2 text-xs font-semibold uppercase">
                  {t("DISCORD_WIDGET.USER_CARD.ROLES")}
                </h4>
                <div className="flex max-h-32 flex-wrap gap-1.5 overflow-y-auto">
                  {props.member.roles.map((role) => (
                    <RoleBadgeIcon
                      key={role.name}
                      role={role.name as StaffRole | StatusRole | LevelRole}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Activity */}
            {props.member.activity && (
              <div className="border-t pt-3">
                <h4 className="mb-1 text-xs font-semibold uppercase">
                  {t("DISCORD_WIDGET.USER_CARD.ACTIVITY")}
                </h4>
                <p className="text-sm">{props.member.activity}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}

export function Team() {
  const t = useTranslations();
  const { data: staffMembers } = useTeamQuery();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <RiTeamFill className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("TEAM.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {(staffMembers ?? []).map((member) => (
          <TeamMemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}
