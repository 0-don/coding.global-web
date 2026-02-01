import { logs } from "@opentelemetry/api-logs";
import { OTLPLogExporter } from "@opentelemetry/exporter-logs-otlp-http";
import { resourceFromAttributes } from "@opentelemetry/resources";
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from "@opentelemetry/sdk-logs";
import { type Instrumentation } from "next";

const isDev = process.env.NODE_ENV === "development";

const loggerProvider =
  !isDev && process.env.NEXT_PUBLIC_POSTHOG_KEY
    ? new LoggerProvider({
        resource: resourceFromAttributes({
          "service.name": "coding-global-web-nextjs",
        }),
        processors: [
          new BatchLogRecordProcessor(
            new OTLPLogExporter({
              url: "https://eu.i.posthog.com/i/v1/logs",
              headers: {
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_POSTHOG_KEY}`,
                "Content-Type": "application/json",
              },
            }),
          ),
        ],
      })
    : null;

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    if (loggerProvider) {
      logs.setGlobalLoggerProvider(loggerProvider);
    }

    // Submit to IndexNow on server startup (production only)
    if (!isDev) {
      setTimeout(async () => {
        try {
          const { IndexNowSubmitter } = await import("indexnow-submitter");
          const siteUrl = process.env.NEXT_PUBLIC_URL || "https://coding.global";
          const key = "fd9e796366e293deabcb9be55dca07c5";

          const indexNow = new IndexNowSubmitter({
            key,
            host: new URL(siteUrl).host,
            keyPath: `${siteUrl}/${key}.txt`,
          });

          console.log("[IndexNow] Submitting sitemap...");
          await indexNow.submitFromSitemap(`${siteUrl}/sitemap.xml`);
          const analytics = indexNow.getAnalytics();
          console.log(`[IndexNow] Done: ${analytics.successfulSubmissions} submitted, ${analytics.failedSubmissions} failed`);
        } catch (error) {
          console.error("[IndexNow] Failed:", error);
        }
      }, 10000);
    }
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
) => {
  if (isDev) return;
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = await import("./lib/posthog-server");
    const posthog = await getPostHogServer();
    let distinctId = null;
    if (request.headers.cookie) {
      const cookieString = Array.isArray(request.headers.cookie)
        ? request.headers.cookie.join("; ")
        : request.headers.cookie;
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/,
      );
      if (postHogCookieMatch?.[1]) {
        try {
          const decodedCookie = decodeURIComponent(postHogCookieMatch[1]);
          const postHogData = JSON.parse(decodedCookie);
          distinctId = postHogData.distinct_id;
        } catch (e) {
          console.error("Error parsing PostHog cookie:", e);
        }
      }
    }
    await posthog.captureException(err, distinctId || undefined);
  }
};
