import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { For } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { MetaHead } from "~/components/elements/meta-head";
import { DiscordHook } from "~/components/hook/discord-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

dayjs.extend(relativeTime);

export default function NewsPage() {
  const { t } = useLanguage();
  const { newsQuery } = DiscordHook();

  return (
    <>
      <MetaHead
        title={t("NEWS.META.TITLE")!}
        description={t("NEWS.META.DESCRIPTION")!}
        keywords={t("NEWS.META.KEYWORDS")}
      />

      <Layout container class="mt-10 h-[calc(100vh-5rem)]">
        <Card class="flex h-full flex-col bg-card/80 px-10 py-5">
          <Header name="NEWS.TITLE" />
          <div class="mt-5 flex-1 overflow-y-auto px-1">
            <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <For each={newsQuery.data}>
                {(news) => (
                  <Card class="overflow-hidden">
                    {news.attachments.length > 0 && (
                      <div class="h-48 overflow-hidden">
                        <img
                          src={news.attachments[0].url}
                          alt={news.content}
                          class="h-full w-full object-cover"
                          loading="lazy"
                        />
                      </div>
                    )}
                    <CardHeader class="flex items-start gap-4">
                      <div class="flex items-center gap-3">
                        <img
                          src={news.user.displayAvatarURL}
                          alt={news.user.username}
                          class="h-8 w-8 rounded-full"
                        />
                        <div>
                          <h3 class="text-sm font-semibold">
                            {news.user.globalName || news.user.username}
                          </h3>
                          <p class="text-xs text-muted-foreground">
                            {dayjs(news.createdAt).fromNow()}
                          </p>
                        </div>
                      </div>
                    </CardHeader>
                    {news.content && (
                      <CardContent>
                        <p class="text-sm">{news.content}</p>
                      </CardContent>
                    )}
                  </Card>
                )}
              </For>
            </div>
          </div>
        </Card>
      </Layout>
    </>
  );
}
