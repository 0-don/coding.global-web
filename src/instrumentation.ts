import { type Instrumentation } from "next";

const isDev = process.env.NODE_ENV === "development";

export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    // Submit to IndexNow on server startup (production only)
    if (!isDev) {
      setTimeout(async () => {
        try {
          const { IndexNowSubmitter } = await import("indexnow-submitter");
          const siteUrl = process.env.NEXT_PUBLIC_URL || "https://coding.global";
          const key = process.env.INDEXNOW_KEY;

          const indexNow = new IndexNowSubmitter({
            key,
            host: new URL(siteUrl).host,
            keyPath: `${siteUrl}/${key}.txt`,
            batchSize: 10000,
          });

          // Silence winston's verbose URL logging from indexnow-submitter
          const { transports } = await import("winston");
          const originalAdd = transports.Console.prototype.log;
          transports.Console.prototype.log = function () {};

          const localUrl = `http://0.0.0.0:${process.env.PORT || 3000}/sitemap.xml`;
          console.log("[IndexNow] Submitting sitemap...");
          await indexNow.submitFromSitemap(localUrl);
          const analytics = indexNow.getAnalytics();
          console.log(`[IndexNow] Done: ${analytics.successfulSubmissions} submitted, ${analytics.failedSubmissions} failed`);

          transports.Console.prototype.log = originalAdd;
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
