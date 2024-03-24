import { createSession } from "@solid-mediakit/auth/client";
import { TbTrashXFilled } from "solid-icons/tb";
import { For, Show } from "solid-js";
import { CreateMessage } from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";
import { useI18nContext } from "~/i18n/i18n-solid";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";
import { Header } from "~/components/container/header";

export default function Chat() {
  const session = createSession();
  const { LL } = useI18nContext();
  const { commentsQuery, commentDelete } = CommentHook();

  return (
    <Layout>
      <section class="container mx-auto">
        <Header name="Chat" />
        <Card class="mt-10 bg-secondary p-5">
          <For each={commentsQuery.data}>
            {(comment) => (
              <Card class="flex w-64 items-center justify-between truncate p-5">
                <Show when={comment?.user?.image}>
                  {(img) => <img src={img()} />}
                </Show>
                <span>{comment.content}</span>
                <TbTrashXFilled
                  class="cursor-pointer hover:text-red-500"
                  onClick={() => commentDelete.mutateAsync(comment.id!)}
                />
              </Card>
            )}
          </For>

          <CreateMessage />
        </Card>
      </section>
    </Layout>
  );
}
