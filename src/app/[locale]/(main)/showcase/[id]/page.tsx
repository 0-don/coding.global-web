import { ThreadDetailSkeleton } from "@/components/elements/thread/thread-detail-skeleton";
import { ShowcaseDetail } from "@/components/pages/showcase/showcase-detail";
import { serverLocale } from "@/lib/utils/server";
import { getThread, getThreadPageMetadata } from "@/lib/utils/thread-metadata";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  const thread = await getThread(params.id, "showcase");

  return getThreadPageMetadata(thread, locale, {
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
  });
}

export default async function ShowcaseDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;

  return (
    <Suspense fallback={<ThreadDetailSkeleton />}>
      <ShowcaseDetail threadId={params.id} />
    </Suspense>
  );
}
