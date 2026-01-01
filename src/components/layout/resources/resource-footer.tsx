"use client";

import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";

export function ResourceFooter() {
  const t = useTranslations();

  return (
    <footer className="mt-16">
      <Separator className="mb-6" />
      <p className="text-muted-foreground text-sm">
        {t("RESOURCES.FOOTER.CONTRIBUTE_TEXT")}{" "}
        <a
          href="https://github.com/0-don/coding.global-web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {t("RESOURCES.FOOTER.GITHUB")}
        </a>{" "}
        {t("RESOURCES.FOOTER.OR_JOIN")}{" "}
        <a
          href="https://discord.gg/coding"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          {t("RESOURCES.FOOTER.DISCORD")}
        </a>
        .
      </p>
    </footer>
  );
}
