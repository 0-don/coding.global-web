import { Showcase } from "@/components/pages/community/showcase/showcase";
import { ListItemStoreProvider } from "@/components/provider/store/list-item-store-provider";
import { getPageMetadata } from "@/lib/config/metadata";
import getQueryClient from "@/lib/react-query/client";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { getCookieValue, serverLocale } from "@/lib/utils/server";
import { ListItemState, getListItemStoreKey } from "@/store/list-item-store";
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
  });
}

export default async function ShowcasePage() {
  const queryClient = getQueryClient();

  const [, listItemStore, t] = await Promise.all([
    queryClient.prefetchQuery({
      queryKey: queryKeys.boardThreads("showcase"),
      queryFn: async () =>
        handleElysia(await rpc.api.bot.board({ boardType: "showcase" }).get()),
    }),
    getCookieValue<ListItemState>(getListItemStoreKey("showcase")),
    getTranslations(),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ListItemStoreProvider boardType="showcase" data={listItemStore}>
        {/* <Suspense
          
          // fallback={
          //   <BoardListSkeleton
          //     title={t("SHOWCASE.HEADING")}
          //     icon={HiOutlineTrophy}
          //   />
          // }
        > */}
        <Showcase />
        {/* </Suspense> */}
      </ListItemStoreProvider>
    </HydrationBoundary>
  );
}
