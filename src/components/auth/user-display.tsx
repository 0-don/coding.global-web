"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSessionHook } from "@/hook/session-hook";
import { useTranslations } from "next-intl";

export function UserDisplay() {
  const t = useTranslations();
  const { data: session } = useSessionHook();

  if (!session?.user) return null;

  const user = session.user;
  const initials =
    user.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U";

  return (
    <div className="flex items-center gap-3 rounded-full border border-primary bg-black/70 px-4 py-2 backdrop-blur-sm">
      <Avatar className="size-8 border border-primary">
        <AvatarImage src={user.image || ""} alt={user.name || "User"} />
        <AvatarFallback className="bg-primary text-xs text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium text-white">
        {t("MAIN.AUTH.WELCOME", { name: user.name || "User" })}
      </span>
    </div>
  );
}
