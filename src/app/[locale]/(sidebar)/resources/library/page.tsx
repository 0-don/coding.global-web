import { TOCLayout } from "@/components/layout/resources/toc";
import { Library, libraryTOC } from "@/components/pages/resources/library";
import { ArticleJsonLd } from "@/components/seo/article-json-ld";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("RESOURCES.LIBRARY.META.TITLE"),
    description: t("RESOURCES.LIBRARY.META.DESCRIPTION"),
    keywords: t("RESOURCES.LIBRARY.META.KEYWORDS"),
    href: "/resources/library",
  });
}

export default async function LibraryPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.LIBRARY.META.TITLE"),
          description: t("RESOURCES.LIBRARY.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/library`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={libraryTOC}>
        <Library />
      </TOCLayout>
    </>
  );
}
