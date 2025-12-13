"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useDiscordWidget } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";

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
  const { data: widget, isLoading } = useDiscordWidget();

  if (isLoading) {
    return <DiscordWidgetSkeleton className={className} />;
  }

  if (!widget) {
    return null;
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={widget.icon} alt={widget.name} />
            <AvatarFallback>{widget.name?.[0] || "D"}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold leading-none">{widget.name}</h3>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">
                  {widget.presenceCount} Online
                </span>
              </div>
              <Separator orientation="vertical" className="h-3" />
              <span className="text-xs text-muted-foreground">
                {widget.memberCount} Members
              </span>
            </div>
          </div>
        </div>
      </CardHeader>

      {widget.members.length > 0 && (
        <CardContent className="max-h-96 overflow-y-auto p-3">
          <h4 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
            Members — {widget.members.length}
          </h4>
          <div className="space-y-1">
            {widget.members.map((member) => (
              <div
                key={member.id}
                className="flex items-start gap-2 rounded-md px-2 py-2 transition-colors hover:bg-accent"
              >
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.avatar} alt={member.username} />
                    <AvatarFallback>{member.username[0]}</AvatarFallback>
                  </Avatar>
                  <span
                    className={cn(
                      "absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-card",
                      STATUS_COLORS[member.status as keyof typeof STATUS_COLORS] ||
                        STATUS_COLORS.offline,
                    )}
                    aria-label={`Status: ${member.status}`}
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
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      Playing {member.activity}
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

function DiscordWidgetSkeleton({ className }: { className?: string }) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-40" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <Skeleton className="mb-2 h-3 w-24" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
