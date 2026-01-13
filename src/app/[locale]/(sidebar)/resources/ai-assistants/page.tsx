import { TOCLayout } from "@/components/layout/resources/toc";
import {
  AiAssistants,
  aiAssistantsTOC,
} from "@/components/pages/resources/ai-assistants";
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
  });
}

export default function AiAssistantsPage() {
  return (
    <TOCLayout toc={aiAssistantsTOC}>
      <AiAssistants />
    </TOCLayout>
  );
}
