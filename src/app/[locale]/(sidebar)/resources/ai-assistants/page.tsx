import { TOCLayout } from "@/components/layout/resources/toc";
import {
  AiAssistants,
  aiAssistantsTOC,
} from "@/components/pages/resources/ai-assistants";
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
    title: t("RESOURCES.AI_ASSISTANTS.META.TITLE"),
    description: t("RESOURCES.AI_ASSISTANTS.META.DESCRIPTION"),
    keywords: t("RESOURCES.AI_ASSISTANTS.META.KEYWORDS"),
    href: "/resources/ai-assistants",
  });
}

export default async function AiAssistantsPage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return (
    <>
      <ArticleJsonLd
        data={{
          headline: t("RESOURCES.AI_ASSISTANTS.META.TITLE"),
          description: t("RESOURCES.AI_ASSISTANTS.META.DESCRIPTION"),
          pageUrl: `${process.env.NEXT_PUBLIC_URL}/${locale}/resources/ai-assistants`,
          inLanguage: locale,
        }}
      />
      <TOCLayout toc={aiAssistantsTOC}>
        <AiAssistants />
      </TOCLayout>
    </>
  );
}
