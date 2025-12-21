"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { GetApiByGuildIdWidget200MembersItem } from "@/openapi";
import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { IoDiamondSharp } from "react-icons/io5";
import { RiVipDiamondFill } from "react-icons/ri";
import { toast } from "sonner";
import {
  LevelRole,
  MemberStatus,
  RoleBadgeIcon,
  StaffRole,
  StatusIndicator,
  StatusRole,
} from "../utils/enums";
interface DiscordUserProps {
  className?: string;
  user?: GetApiByGuildIdWidget200MembersItem;
  enableBanner?: boolean;
}

export function DiscordUser(props: DiscordUserProps) {
  const t = useTranslations();

  if (!props.user) return null;

  const bannerStyle = props.user.bannerUrl
    ? { backgroundImage: `url(${props.user.bannerUrl})` }
    : props.user.bannerUrl
      ? { backgroundColor: `#${props.user.bannerUrl}` }
      : { backgroundColor: props.user.displayHexColor || "#5865F2" };

  const copyUsername = async () => {
    try {
      await navigator.clipboard.writeText(props.user!.username);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USERNAME_COPIED"));
    } catch (err) {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  const copyUserId = async () => {
    try {
      await navigator.clipboard.writeText(props.user!.id);
      toast.success(t("DISCORD_WIDGET.USER_CARD.USER_ID_COPIED"));
    } catch (err) {
      toast.error(t("DISCORD_WIDGET.USER_CARD.COPY_FAILED"));
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        render={
          <div
            className={cn(
              "group/user relative flex cursor-pointer items-start gap-2 overflow-hidden rounded-md py-2 transition-colors",
              props.className,
            )}
          >
            {/* Banner on the right side with diagonal fade */}
            {props.user.bannerUrl && props.enableBanner && (
              <div className="absolute top-0 right-0 h-full w-1/2 overflow-hidden">
                <div
                  className="h-full w-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${props.user.bannerUrl})`,
                    maskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 100%)",
                    WebkitMaskImage:
                      "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 100%)",
                  }}
                />
              </div>
            )}

            <div className="relative z-10">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={props.user.avatarUrl}
                  alt={props.user.username}
                />
                <AvatarFallback>
                  {props.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <StatusIndicator status={props.user.status as MemberStatus} />
            </div>

            <div className="relative z-10 min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="truncate text-sm font-medium group-hover/user:underline">
                  {props.user.displayName}
                </span>
                {props.user.premiumSince && (
                  <IoDiamondSharp
                    className="h-4 w-4 shrink-0"
                    style={{
                      color: "#FF73FA",
                      filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                    }}
                  />
                )}
                {props.user.activity && (
                  <p className="text-muted-foreground truncate text-xs">
                    {t("DISCORD_WIDGET.PLAYING", {
                      activity: props.user.activity,
                    })}
                  </p>
                )}
              </div>

              {props.user.roles?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1 text-xs">
                  <RoleBadgeIcon
                    role={props.user.roles?.[0]?.name as StaffRole}
                  />
                </div>
              )}
            </div>
          </div>
        }
        nativeButton={false}
      />
      <PopoverContent
        side={"bottom"}
        align={"start"}
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
                <h5 className="truncate text-xl font-bold group-hover/user:underline">
                  {props.user.displayName}
                </h5>
                {props.user.premiumSince && (
                  <RiVipDiamondFill
                    className="h-5 w-5 shrink-0"
                    style={{
                      color: "#FF73FA",
                      filter: "drop-shadow(0 0 2px rgba(59, 137, 255, 0.5))",
                    }}
                  />
                )}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={copyUsername}
                  className="text-muted-foreground hover:text-foreground cursor-pointer truncate text-left text-sm transition-colors"
                  type="button"
                >
                  {props.user.username}
                </button>

                <button
                  onClick={copyUserId}
                  className="text-muted-foreground hover:text-foreground cursor-pointer truncate text-left text-xs transition-colors"
                  type="button"
                >
                  {props.user.id}
                </button>
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
                  {props.user.roles.map((role, index) => (
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
