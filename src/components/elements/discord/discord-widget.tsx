"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDiscordWidget } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import {
  MemberStatus,
  RoleBadgeIcon,
  StaffRole,
  StatusIndicator,
} from "../utils/enums";
import { DiscordUserPopover } from "./discord-user-popover";

interface DiscordWidgetProps {
  className?: string;
}

export function DiscordWidget(props: DiscordWidgetProps) {
  const t = useTranslations();
  const { data: widget } = useDiscordWidget();

  if (!widget) return null;

  return (
    <Card className={cn("overflow-hidden", props.className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={widget.iconURL || "/images/avatar.svg"}
              alt={widget.name}
            />
            <AvatarFallback>{widget.name?.[0] || "D"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="w-38 truncate">{widget.name}</h3>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-muted-foreground text-xs">
                  {widget.presenceCount} {t("DISCORD_WIDGET.ONLINE")}
                </span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-muted-foreground text-xs">
                {widget.memberCount} {t("DISCORD_WIDGET.MEMBERS")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {widget.members.length > 0 && (
        <CardContent className="max-h-96 overflow-y-auto p-3">
          <h4 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            {t("DISCORD_WIDGET.MEMBERS_HEADER", {
              count: widget.members.length,
            })}
          </h4>
          <div className="space-y-1">
            {widget.members.map((member) => {
              const statusRoles = member.roles.at(0);

              return (
                <DiscordUserPopover key={member.id} user={member}>
                  <div className="hover:bg-accent/20 flex cursor-pointer items-start gap-2 rounded-md px-2 py-2 transition-colors">
                    <div className="relative">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={member.displayAvatarURL}
                          alt={member.username}
                        />
                        <AvatarFallback>{member.username}</AvatarFallback>
                      </Avatar>
                      <StatusIndicator status={member.status as MemberStatus} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="truncate text-sm font-medium">
                          {member.displayName}
                        </span>
                        {member.roles?.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            <RoleBadgeIcon
                              role={statusRoles?.name as StaffRole}
                            />
                          </div>
                        )}
                      </div>
                      {member.activity && (
                        <p className="text-muted-foreground mt-0.5 truncate text-xs">
                          {t("DISCORD_WIDGET.PLAYING", {
                            activity: member.activity,
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </DiscordUserPopover>
              );
            })}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
