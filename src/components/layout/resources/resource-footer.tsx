"use client";

import { Separator } from "@/components/ui/separator";
import { useTranslations } from "next-intl";
import posthog from "posthog-js";

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
          onClick={() =>
            posthog.capture("external_link_clicked", {
              section: "resource_footer",
              destination: "github",
            })
          }
        >
          {t("RESOURCES.FOOTER.GITHUB")}
        </a>{" "}
        {t("RESOURCES.FOOTER.OR_JOIN")}{" "}
        <a
          href="https://discord.gg/coding"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
          onClick={() =>
            posthog.capture("discord_link_clicked", {
              section: "resource_footer",
            })
          }
        >
          {t("RESOURCES.FOOTER.DISCORD")}
        </a>
        .
      </p>
    </footer>
  );
}
