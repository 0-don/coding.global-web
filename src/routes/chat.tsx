import { Header } from "~/components/container/header";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import { CreateMessage } from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";
import { Layout } from "../components/container/layout";

export default function Chat() {
  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="Chat" />
        <ChatMessages />
        <CreateMessage />
      </Card>
    </Layout>
  );
}
