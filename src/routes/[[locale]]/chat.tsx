import { RouteDefinition } from "@solidjs/router";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { serverFnComments } from "~/components/hook/chat-hook";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import CreateMessage from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";

export const route = {
  preload: () => serverFnComments(),
} satisfies RouteDefinition;

export default function ChatPage() {
  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="CHAT.TITLE" />
        <ChatMessages class="my-5 flex-1 overflow-y-auto" />
        <CreateMessage />
      </Card>
    </Layout>
  );
}
