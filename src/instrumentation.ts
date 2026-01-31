/* eslint-disable @typescript-eslint/no-require-imports */
import { type Instrumentation } from "next";

export function register() {
  // No-op for initialization
}

export const onRequestError: Instrumentation.onRequestError = async (
  err,
  request,
  context,
) => {
  if (process.env.NODE_ENV === "development") return;
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { getPostHogServer } = require("./lib/posthog-server");
    const posthog = await getPostHogServer();
    let distinctId = null;
    if (request.headers.cookie) {
      // Normalize multiple cookie arrays to string
      const cookieString = Array.isArray(request.headers.cookie)
        ? request.headers.cookie.join("; ")
        : request.headers.cookie;
      const postHogCookieMatch = cookieString.match(
        /ph_phc_.*?_posthog=([^;]+)/,
      );
      if (postHogCookieMatch && postHogCookieMatch[1]) {
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
