import "@dotenvx/dotenvx/config";

import { log } from "console";
import { IndexNowSubmitter } from "indexnow-submitter";

const INDEXNOW_KEY = "fd9e796366e293deabcb9be55dca07c5";
const SITE_URL = process.env.NEXT_PUBLIC_URL || "https://coding.global";
const SITEMAP_URL = `${SITE_URL}/sitemap.xml`;

async function submitToIndexNow() {
  const indexNow = new IndexNowSubmitter({
    key: INDEXNOW_KEY,
    host: new URL(SITE_URL).host,
    keyPath: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
  });

  log(`[IndexNow] Fetching sitemap from ${SITEMAP_URL}`);

  await indexNow.submitFromSitemap(SITEMAP_URL);

  const analytics = indexNow.getAnalytics();
  log(`[IndexNow] Total: ${analytics.totalSubmissions}`);
  log(`[IndexNow] Successful: ${analytics.successfulSubmissions}`);
  log(`[IndexNow] Failed: ${analytics.failedSubmissions}`);
  log(`[IndexNow] Avg response time: ${analytics.averageResponseTime}ms`);

  return analytics;
}

submitToIndexNow()
  .then((analytics) => {
    process.exit(analytics.failedSubmissions > 0 ? 1 : 0);
  })
  .catch((error) => {
    console.error("[IndexNow] Fatal error:", error);
    process.exit(1);
  });
