import { ShowcaseDetail } from "@/components/pages/showcase-detail";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
  });
}

export default async function ShowcaseDetailPage(props: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const params = await props.params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.showcaseThreadMessages(params.id),
    queryFn: async () =>
      handleElysia(await rpc.api.bot.showcase({ threadId: params.id }).get()),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ShowcaseDetail threadId={params.id} />
    </HydrationBoundary>
  );
}
