import { Metadata } from "next";
import { Locale } from "next-intl";
import { ALTERNATE_LANGUAGES, LANGUAGES, LOCALES } from "./constants";

type Params = {
  locale: Locale | (string & {});
  title: string;
  description: string;
  keywords: string;
  path?: string;
  ogImage?: string;
  robots?: boolean;
};

export async function getPageMetadata(params: Params): Promise<Metadata> {
  const canonicalPath = params.path || `/${params.locale}`;
  const ogImageUrl = params.ogImage || "/images/logo.gif";
  const shouldIndex = params.robots ?? true;

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
    title: params.title,
    description: params.description,
    keywords: params.keywords.split(", "),
    authors: [{ name: process.env.NEXT_PUBLIC_APP_NAME }],
    alternates: {
      canonical: canonicalPath,
      languages: {
        ...ALTERNATE_LANGUAGES,
        "x-default": `/${LOCALES[0]}`,
      },
    },
    openGraph: {
      title: params.title,
      description: params.description,
      type: "website",
      locale: LANGUAGES.find((l) => l.code === params.locale.toUpperCase())
        ?.ogLocale,
      alternateLocale: LANGUAGES.map((l) => l.ogLocale),
      siteName: process.env.NEXT_PUBLIC_APP_NAME,
      images: [
        {
          url: ogImageUrl,
          alt: params.title,
          type: "image/png",
          width: 512,
          height: 512,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: params.title,
      description: params.description,
      images: [
        {
          url: ogImageUrl,
          alt: params.title,
          type: "image/png",
          width: 512,
          height: 512,
        },
      ],
    },
    robots: {
      index: shouldIndex,
      follow: shouldIndex,
      nocache: !shouldIndex,
      googleBot: {
        index: shouldIndex,
        follow: shouldIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}
