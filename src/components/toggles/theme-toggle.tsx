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
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
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
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <FiSun className="mr-2 size-4" />
          {t("MAIN.ENUM.LIGHT")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <BsMoonStars className="mr-2 size-4" />
          {t("MAIN.ENUM.DARK")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <AiOutlineLaptop className="mr-2 size-4" />
          {t("MAIN.ENUM.SYSTEM")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
