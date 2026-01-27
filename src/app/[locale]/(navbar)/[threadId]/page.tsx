import { redirect } from "@/i18n/navigation";
import { rpc } from "@/lib/rpc";
import { ApiThreadType } from "@/lib/types";
import { getThreadPathname } from "@/lib/utils/base";
import { serverLocale } from "@/lib/utils/server";
import { notFound } from "next/navigation";

export default async function ThreadRedirectPage(props: {
  params: Promise<{ locale: string; threadId: string }>;
}) {
  const [params, locale] = await Promise.all([props.params, serverLocale(props)]);
  const response = await rpc.api.bot["thread-lookup"]({ threadId: params.threadId }).get();

  if (response.status !== 200 || !response.data) {
    notFound();
  }

  redirect({
    href: getThreadPathname(response.data.boardType as ApiThreadType, response.data.threadId),
    locale,
  });
}
