"use client";

import { CompanyName, LogoImage } from "@/components/elements/utils/images";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LuMenu } from "react-icons/lu";
import { MobileNavigationContent } from "./mobile-navigation-content";

export function MobileNav() {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <button className="hover:bg-muted hover:text-foreground dark:hover:bg-muted/50 inline-flex size-9 items-center justify-center rounded-md transition-all xl:hidden" />
        }
      >
        <LuMenu className="text-3xl" />
        <span className="sr-only">{t("MAIN.NAVIGATION.OPEN_MENU")}</span>
      </SheetTrigger>
      <SheetContent side="left" className="z-9999 flex w-75 flex-col sm:w-100">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <LogoImage />
            <CompanyName className="text-lg font-bold" />
          </SheetTitle>
        </SheetHeader>

        <MobileNavigationContent onNavigate={() => setOpen(false)} />
      </SheetContent>
    </Sheet>
  );
}
