import { Header } from "~/components/container/header";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import { Card } from "~/components/ui/card";
import { Layout } from "../components/container/layout";
import CreateMessage from "~/components/pages/chat/create-message";

// const CreateMessage = clientOnly(
//   () => import("~/components/pages/chat/create-message"),
// );

export default function Chat() {
  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="Chat" />
        <ChatMessages class="my-5 flex-1 overflow-y-auto" />

        <CreateMessage />
      </Card>
    </Layout>
  );
}
