import { MetadataRoute } from "next";
import { getTranslations } from "next-intl/server";
import { routing } from "../i18n/routing";

export const dynamic = "force-static";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations({
    locale: routing.defaultLocale,
  });

  return {
    name: t("MAIN.MANIFEST.TITLE", {
      appName: process.env.NEXT_PUBLIC_APP_NAME,
    }),
    short_name: t("MAIN.MANIFEST.SHORT_NAME"),
    description: t("MAIN.MANIFEST.DESCRIPTION"),
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#101E33",
    icons: [
      {
        src: "/images/manifest/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/manifest/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
