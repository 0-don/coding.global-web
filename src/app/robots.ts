import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteOrigin = new URL(process.env.NEXT_PUBLIC_URL).origin;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${siteOrigin}/sitemap.xml`,
    host: siteOrigin,
  };
}
