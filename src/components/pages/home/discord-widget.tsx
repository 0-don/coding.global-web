"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useDiscordWidget } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { DiscordUser } from "../../elements/discord/discord-user";

interface DiscordWidgetProps {
  className?: string;
}

export function DiscordWidget(props: DiscordWidgetProps) {
  const t = useTranslations();
  const { data: widget } = useDiscordWidget();

  if (!widget) return null;

  return (
    <Card className={cn("overflow-hidden pt-0", props.className)}>
      <CardHeader className="relative border-b py-0">
        {/* Banner with diagonal fade */}
        <div className="absolute top-0 right-0 h-full w-2/3 overflow-hidden">
          <div
            className="h-full w-full bg-cover bg-center"
            style={{
              backgroundImage: widget.bannerURL
                ? `url(${widget.bannerURL})`
                : "none",
              maskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 100%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.7) 60%, black 100%)",
            }}
          />
        </div>

        <div className="relative z-10 mt-5 flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={widget.iconURL || "/images/avatar.svg"}
              alt={widget.name}
            />
            <AvatarFallback>{widget.name?.at(0)?.toUpperCase()}</AvatarFallback>
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
            {widget.members.map((member) => (
              <DiscordUser key={member.id} user={member} />
            ))}
          </div>
        </CardContent>
      )}
    </Card>
  );
}
