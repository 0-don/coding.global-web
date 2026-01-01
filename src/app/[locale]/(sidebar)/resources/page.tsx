import { TOCLayout } from "@/components/layout/resources/toc";
import { Resources, resourcesTOC } from "@/components/pages/resources/resources";
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
    title: t("RESOURCES.META.TITLE"),
    description: t("RESOURCES.META.DESCRIPTION"),
    keywords: t("RESOURCES.META.KEYWORDS"),
  });
}

export default function ResourcesPage() {
  return (
    <TOCLayout toc={resourcesTOC}>
      <Resources />
    </TOCLayout>
  );
}
