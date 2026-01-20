import posthog from "posthog-js";

posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
  api_host: "https://ph.coding.global",
  ui_host: "https://eu.posthog.com",
  defaults: "2025-05-24",
  capture_performance: true,
  capture_heatmaps: true,
});
