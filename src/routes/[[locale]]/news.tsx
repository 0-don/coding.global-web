import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { For } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { DiscordHook } from "~/components/hook/discord-hook";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

dayjs.extend(relativeTime);

export default function NewsPage() {
  const { newsQuery } = DiscordHook();

  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
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
  );
}
