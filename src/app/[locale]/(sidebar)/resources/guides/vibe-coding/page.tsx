import { TOCLayout } from "@/components/layout/resources/toc";
import {
  VibeCoding,
  vibeCodingTOC,
} from "@/components/pages/resources/guides/vibe-coding";
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
  });
}

export default async function VibeCodingPage() {
  const tweet = await getTweet("1886192184808149383");

  return (
    <TOCLayout toc={vibeCodingTOC}>
      <VibeCoding tweet={tweet} />
    </TOCLayout>
  );
}
