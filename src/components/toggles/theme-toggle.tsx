"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { AiOutlineLaptop } from "react-icons/ai";
import { BsMoonStars } from "react-icons/bs";
import { FiSun } from "react-icons/fi";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="size-9 border border-primary bg-black/70 text-white hover:bg-primary hover:text-primary-foreground"
          title={t("MAIN.TOOLTIP.TOGGLE_THEME")}
        >
          {mounted ? (
            theme === "dark" ? (
              <BsMoonStars className="size-5" />
            ) : (
              <FiSun className="size-5" />
            )
          ) : (
            <FiSun className="size-5" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="border-primary bg-black/90">
        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <FiSun className="mr-2 size-4" />
          {t("MAIN.ENUM.LIGHT")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <BsMoonStars className="mr-2 size-4" />
          {t("MAIN.ENUM.DARK")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="hover:bg-primary hover:text-primary-foreground"
        >
          <AiOutlineLaptop className="mr-2 size-4" />
          {t("MAIN.ENUM.SYSTEM")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
