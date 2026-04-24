import { Showcase } from "@/components/pages/community/showcase/showcase";
import { ThreadStoreProvider } from "@/components/provider/store/thread-store-provider";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ThreadState, getThreadStoreKey } from "@/store/thread-store";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });
  return getPageMetadata({
    locale,
    title: t("SHOWCASE.META.TITLE"),
    description: t("SHOWCASE.META.DESCRIPTION"),
    keywords: t("SHOWCASE.META.KEYWORDS"),
    href: "/community/showcase",
  });
}

export default async function ShowcasePage(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const queryClient = getQueryClient();
  const baseUrl = process.env.NEXT_PUBLIC_URL;

  const [, listItemStore] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.threads("showcase"),
      queryFn: async () =>
        handleElysia(
          await rpc.api.bot.thread({ threadType: "showcase" }).get(),
        ),
    }),
    getCookieValue<ThreadState>(getThreadStoreKey("showcase")),
    getTranslations(),
  ]);

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", url: `${baseUrl}/${locale}` },
          { name: "Community", url: `${baseUrl}/${locale}/community/showcase` },
          { name: "Showcase" },
        ]}
      />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ThreadStoreProvider threadType="showcase" data={listItemStore}>
          <Showcase />
        </ThreadStoreProvider>
      </HydrationBoundary>
    </>
  );
}
