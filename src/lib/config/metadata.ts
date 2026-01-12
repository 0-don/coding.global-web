import { GetApiByGuildIdThreadByThreadTypeByThreadId200 } from "@/openapi";
import { Metadata } from "next";
import { MetadataKeys, MetadataParams } from "../types";
import { ALTERNATE_LANGUAGES, LANGUAGES, LOCALES } from "./constants";

export async function getPageMetadata(
  params: MetadataParams,
): Promise<Metadata> {
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

export async function getThreadPageMetadata(
  thread: GetApiByGuildIdThreadByThreadTypeByThreadId200 | null,
  locale: string,
  fallback: MetadataKeys,
) {
  if (thread) {
    const tagNames = thread.tags?.map((tag) => tag.name).join(", ") || "";
    const keywords = tagNames
      ? `${tagNames}, ${fallback.keywords}`
      : fallback.keywords;

    return getPageMetadata({
      locale,
      title: `${thread.name} - Coding Global`,
      description: thread.name || fallback.description,
      keywords,
    });
  }

  return getPageMetadata({
    locale,
    title: fallback.title,
    description: fallback.description,
    keywords: fallback.keywords,
  });
}
