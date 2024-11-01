import { RouteDefinition } from "@solidjs/router";
import { createEffect } from "solid-js";
import { Header } from "~/components/container/header";
import { CommentHook } from "~/components/hook/comment-hook";
import { prefetchTodos } from "~/components/hook/todo-hook";
import { ChatMessages } from "~/components/pages/chat/chat-messages";
import CreateMessage from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";
import { Layout } from "../components/container/layout";

export const route = {
  preload: () => prefetchTodos(),
} satisfies RouteDefinition;

export default function Chat() {
  const { commentsQuery } = CommentHook();

  createEffect(() => {
    console.log("comments", commentsQuery.data);
  });

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
