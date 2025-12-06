import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { MetadataRoute } from "next";
import { Locale } from "next-intl";

export const dynamic = "force-static";

type Href = Parameters<typeof getPathname>[0]["href"];
const host = new URL(process.env.NEXT_PUBLIC_URL!).origin;

export default function sitemap(): MetadataRoute.Sitemap {
  return [];
}

function getEntries(href: Href): MetadataRoute.Sitemap {
  return routing.locales.map((locale) => ({
    url: getUrl(href, locale),
    lastModified: new Date(),
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((cur) => [cur, getUrl(href, cur)]),
      ),
    },
  }));
}

function getUrl(href: Href, locale: Locale): string {
  const pathname = getPathname({ locale, href });

  // Add locale prefix for all locales in sitemap
  return `${host}/${locale}${pathname}`;
}
