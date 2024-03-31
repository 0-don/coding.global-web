import { clientOnly } from "@solidjs/start";
import { Show, createSignal, onMount } from "solid-js";
import { Header } from "~/components/container/header";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import { Card } from "~/components/ui/card";
import { Layout } from "../components/container/layout";

const CreateMessage = clientOnly(
  () => import("~/components/pages/chat/create-message"),
);

export default function Chat() {
  const [init, setInit] = createSignal(false);

  onMount(() => {
    setInit(true);
  });

  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="Chat" />
        <ChatMessages class="my-5 flex-1 overflow-y-auto" />
        <Show when={init()}>
          <CreateMessage />
        </Show>
      </Card>
    </Layout>
  );
}
