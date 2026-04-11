"use client";

import { UNOROUTER_URL } from "@/lib/config/constants";
import { cn } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import posthog from "posthog-js";

type BadgeType =
  | "hero"
  | "sponsor"
  | "banner"
  | "square"
  | "providers"
  | "pricing";

interface UnoRouterBadgeProps {
  badge: BadgeType;
  className?: string;
}

const BADGE_MAX_WIDTH: Record<BadgeType, string> = {
  hero: "max-w-[360px]",
  sponsor: "max-w-[480px]",
  banner: "max-w-[380px]",
  square: "max-w-[140px]",
  providers: "max-w-[360px]",
  pricing: "max-w-[420px]",
};

export function UnoRouterBadge(props: UnoRouterBadgeProps) {
  const t = useTranslations();
  const locale = useLocale();
  const { resolvedTheme } = useTheme();

  const theme = resolvedTheme === "light" ? "light" : "dark";
  const src = `${UNOROUTER_URL}/api/badge/${props.badge}?theme=${theme}&locale=${locale}&size=sm`;

  return (
    <a
      href={UNOROUTER_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "block w-full",
        BADGE_MAX_WIDTH[props.badge],
        props.className,
      )}
      onClick={() =>
        posthog.capture("unorouter_badge_clicked", {
          badge: props.badge,
        })
      }
    >
      <img
        src={src}
        alt={t("UNOROUTER.BADGE_ALT")}
        className="w-full"
        loading="lazy"
      />
    </a>
  );
}
