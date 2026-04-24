import { TOCLayout } from "@/components/layout/resources/toc";
import {
  VibeCoding,
  vibeCodingTOC,
} from "@/components/pages/resources/guides/vibe-coding";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";
import { getTweet } from "react-tweet/api";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("RESOURCES.VIBE_CODING.META.TITLE"),
    description: t("RESOURCES.VIBE_CODING.META.DESCRIPTION"),
    keywords: t("RESOURCES.VIBE_CODING.META.KEYWORDS"),
    href: "/resources/guides/vibe-coding",
  });
}

export default async function VibeCodingPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const [t, tweet] = await Promise.all([
    getTranslations({ locale }),
    getTweet("1886192184808149383"),
  ]);
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.VIBE_CODING.META.TITLE"),
          description: t("RESOURCES.VIBE_CODING.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/guides/vibe-coding`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={vibeCodingTOC}>
        <VibeCoding tweet={tweet} />
      </TOCLayout>
    </>
  );
}
