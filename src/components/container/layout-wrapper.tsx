"use client";

import { ReactNode } from "react";
import { ThemeToggle } from "@/components/toggles/theme-toggle";
import { LanguageToggle } from "@/components/toggles/language-toggle";
import { LogoutToggle } from "@/components/toggles/logout-toggle";
import { ConsoleToggle } from "@/components/toggles/console-toggle";
import { cn } from "@/lib/utils";

type LayoutWrapperProps = {
  children: ReactNode;
  container?: boolean;
  className?: string;
};

export function LayoutWrapper({ children, container = true, className }: LayoutWrapperProps) {
  return (
    <div className={cn("relative min-h-screen w-full", className)}>
      {/* Fixed toggle buttons - top right corner */}
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <LanguageToggle />
        <ThemeToggle />
        <ConsoleToggle />
        <LogoutToggle />
      </div>

      {/* Main content */}
      {container ? <div className="container mx-auto px-4">{children}</div> : children}
    </div>
  );
}
