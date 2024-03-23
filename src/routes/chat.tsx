import { createSession } from "@solid-mediakit/auth/client";
import { TbTrashXFilled } from "solid-icons/tb";
import { For } from "solid-js";
import { CreateMessage } from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";
import { useI18nContext } from "~/i18n/i18n-solid";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";

export default function Chat() {
  const session = createSession();
  const { LL } = useI18nContext();
  const { commentsQuery, commentDelete } = CommentHook();

  return (
    <Layout>
      <section class="container mx-auto">
        <Card class="mt-10 p-5">
          <For each={commentsQuery.data}>
            {(comment) => (
              <div class="flex w-64 items-center justify-between truncate">
                <span>{comment.content}</span>
                <TbTrashXFilled
                  class="cursor-pointer hover:text-red-500"
                  onClick={() => commentDelete.mutateAsync(comment.id!)}
                />
              </div>
            )}
          </For>

          <CreateMessage />
        </Card>
      </section>
    </Layout>
  );
}
