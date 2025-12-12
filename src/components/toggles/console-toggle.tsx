"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { SiGooglesearchconsole } from "react-icons/si";
import { toast } from "sonner";

export function ConsoleToggle() {
  const t = useTranslations();

  if (process.env.NODE_ENV !== "development") return null;

  function clearConsole() {
    console.clear();
    toast.success(t("MAIN.SUCCESS.CONSOLE_CLEARED"));
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={clearConsole}
      className="size-9 border border-primary bg-black/70 text-white hover:bg-primary hover:text-primary-foreground"
      title={t("MAIN.TOOLTIP.CLEAR_CONSOLE")}
    >
      <SiGooglesearchconsole className="size-5" />
    </Button>
  );
}
