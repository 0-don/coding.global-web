import { TOCLayout } from "@/components/layout/resources/toc";
import {
  Javascript,
  javascriptTOC,
} from "@/components/pages/resources/languages/javascript";
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
    title: t("RESOURCES.JAVASCRIPT.META.TITLE"),
    description: t("RESOURCES.JAVASCRIPT.META.DESCRIPTION"),
    keywords: t("RESOURCES.JAVASCRIPT.META.KEYWORDS"),
  });
}

export default function JavascriptPage() {
  return (
    <TOCLayout toc={javascriptTOC}>
      <Javascript />
    </TOCLayout>
  );
}
