"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSessionHook } from "@/hook/session-hook";
import { authClient } from "@/lib/auth-client";
import { deleteCookie, getCookies } from "cookies-next/client";
import { useTranslations } from "next-intl";
import { ReactNode } from "react";
import { IoLogOut } from "react-icons/io5";

interface UserDropdownProps {
  children: ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  className?: string;
}

export function UserDropdown({
  children,
  side = "bottom",
  align = "end",
  sideOffset = 4,
  className,
}: UserDropdownProps) {
  const session = useSessionHook();
  const t = useTranslations();

  if (!session?.data?.user.id) {
    return null;
  }

  const handleLogout = async () => {
    // Clear all cookies
    Object.keys(getCookies() ?? {}).forEach((cookieName) =>
      deleteCookie(cookieName),
    );

    await authClient.signOut();
    setTimeout(() => window.location.reload()); // react-query hydration issue workaround
  };

  const username = session.data.user.name || "";
  const name = username?.split("@")[0] || "";
  const firstEmailChar = name.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
        side={side}
        align={align}
        sideOffset={sideOffset}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex flex-col gap-2 px-1 py-1.5 text-left text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={""} alt={name} />
                <AvatarFallback className="rounded-lg">
                  {firstEmailChar}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {username}
                </span>
              </div>
            </div>
            {/* {me?.data?.data.roles && me.data.data.roles.length && (
              <div className="flex flex-wrap gap-1 pt-1">
                {me?.data?.data.roles.map((role) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role}
                  </Badge>
                ))}
              </div>
            )} */}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuGroup>
          <DropdownMenuItem>
            <IconUserCircle />
            {t("MAIN.SIDEBAR.USER.SETTINGS")}
          </DropdownMenuItem>
        </DropdownMenuGroup> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IoLogOut />
          {t("MAIN.AUTH.LOGOUT")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
