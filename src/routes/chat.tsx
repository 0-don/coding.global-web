import { createQuery } from "@tanstack/solid-query";
import { createEffect } from "solid-js";
import { Header } from "~/components/container/header";
import { commentsQueryOpts } from "~/components/hook/comment-hook";
import { Card } from "~/components/ui/card";
import { Layout } from "../components/container/layout";

export default function Chat() {
  const commentsQuery = createQuery(commentsQueryOpts);
  // const auth = useAuth();

  createEffect(() => {
    console.log("comments", commentsQuery.data);
  });
  // console.log("session", auth.session());
  return (
    <Layout container class="mt-10 h-[calc(100vh-5rem)]">
      <Card class="flex h-full flex-col bg-secondary/85 p-10">
        <Header name="Chat" />
        {/* <ChatMessages class="my-5 flex-1 overflow-y-auto" />
        <CreateMessage /> */}
      </Card>
    </Layout>
  );
}
