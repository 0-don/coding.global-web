"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDiscordWidget } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface DiscordWidgetProps {
  className?: string;
}

const STATUS_COLORS = {
  online: "bg-green-500",
  idle: "bg-yellow-500",
  dnd: "bg-red-500",
  offline: "bg-muted-foreground",
} as const;

export function DiscordWidget({ className }: DiscordWidgetProps) {
  const { data: widget } = useDiscordWidget();
  const t = useTranslations("DISCORD_WIDGET");

  const getStatusLabel = (status: string) => {
    const statusKey = status.toUpperCase();
    if (statusKey === "ONLINE") return t("STATUS.ONLINE");
    if (statusKey === "IDLE") return t("STATUS.IDLE");
    if (statusKey === "DND") return t("STATUS.DND");
    return t("STATUS.OFFLINE");
  };

  if (!widget) {
    return null;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={widget.icon || "/images/avatar.svg"}
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
                  {widget.presenceCount} {t("ONLINE")}
                </span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-muted-foreground text-xs">
                {widget.memberCount} {t("MEMBERS")}
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {widget.members.length > 0 && (
        <CardContent className="max-h-96 overflow-y-auto p-3">
          <h4 className="text-muted-foreground mb-2 text-xs font-semibold uppercase">
            {t("MEMBERS_HEADER", { count: widget.members.length })}
          </h4>
          <div className="space-y-1">
            {widget.members.map((member) => (
              <div
                key={member.id}
                className="hover:bg-accent flex items-start gap-2 rounded-md px-2 py-2 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "border-card absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full border-2",
                      STATUS_COLORS[
                        member.status as keyof typeof STATUS_COLORS
                      ] || STATUS_COLORS.offline,
                    )}
                    aria-label={getStatusLabel(member.status)}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="truncate text-sm font-medium">
                      {member.username}
                    </span>
                    {member.statusRoles.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {member.statusRoles
                          .sort((a, b) => b.position - a.position)
                          .map((role, idx) => (
                            <Badge
                              key={`${member.id}-${role.name}-${idx}`}
                              variant="secondary"
                              className="h-4 bg-[#5865f2] px-1.5 text-[10px] font-medium text-white hover:bg-[#4752c4]"
                            >
                              {role.name}
                            </Badge>
                          ))}
                      </div>
                    )}
                  </div>
                  {member.activity && (
                    <p className="text-muted-foreground mt-0.5 truncate text-xs">
                      {t("PLAYING", { activity: member.activity })}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
