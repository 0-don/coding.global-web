import posthog from "posthog-js";

const isProduction = process.env.NODE_ENV === "production";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: isProduction ? "https://ph.coding.global" : "/ingest",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
  capture_performance: true,
  capture_heatmaps: true,
});
