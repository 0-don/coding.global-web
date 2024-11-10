import { RouteDefinition } from "@solidjs/router";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { MetaHead } from "~/components/elements/meta-head";
import { serverFnComments } from "~/components/hook/chat-hook";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import CreateMessage from "~/components/pages/chat/create-message";
import { useLanguage } from "~/components/provider/language-provider";
import { Card } from "~/components/ui/card";

export const route = {
  preload: () => serverFnComments(),
} satisfies RouteDefinition;

export default function ChatPage() {
  const { t } = useLanguage();

  return (
    <>
      <MetaHead
        title={t("CHAT.META.TITLE")!}
        description={t("CHAT.META.DESCRIPTION")!}
        keywords={t("CHAT.META.KEYWORDS")}
      />
      <Layout container class="mt-10 h-[calc(100vh-5rem)]">
        <Card class="flex h-full flex-col bg-card/80 p-10">
          <Header name="CHAT.TITLE" />
          <ChatMessages class="my-5 flex-1 overflow-y-auto" />
          <CreateMessage />
        </Card>
      </Layout>
    </>
  );
}
