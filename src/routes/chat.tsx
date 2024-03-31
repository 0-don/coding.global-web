import { createSession } from "@solid-mediakit/auth/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { TbTrashXFilled } from "solid-icons/tb";
import { For, Show } from "solid-js";
import { Header } from "~/components/container/header";
import { CreateMessage } from "~/components/pages/chat/create-message";
import { Card } from "~/components/ui/card";
import { useI18nContext } from "~/i18n/i18n-solid";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";

dayjs.extend(localizedFormat);

export default function Chat() {
  const session = createSession();
  const { LL } = useI18nContext();
  const { commentsQuery, commentDelete } = CommentHook();

  return (
    <Layout>
      <section class="container mx-auto">
        <Card class="mt-10 bg-secondary p-10">
          <Header name="Chat" />
          <For each={commentsQuery.data}>
            {(comment) => (
              <div class="group my-2 flex w-full items-center space-x-2 truncate rounded-md bg-secondary p-1 hover:bg-zinc-200 hover:dark:bg-stone-800">
                <Show when={comment?.user?.image}>
                  {(img) => <img class="h-14 rounded-full" src={img()} />}
                </Show>
                <div class="relative w-full">
                  <div class="flex items-center space-x-2">
                    <p class="font-bold">{comment.user?.name}</p>
                    <p class="text-sm">
                      {dayjs(comment.createdAt).format("L LT")}
                    </p>
                  </div>
                  <div>
                    <p>{comment.content}</p>
                    <TbTrashXFilled
                      class="absolute right-0 top-0 hidden cursor-pointer hover:text-red-500 group-hover:block"
                      onClick={() => commentDelete.mutateAsync(comment.id!)}
                    />
                  </div>
                </div>
              </div>
            )}
          </For>

          <CreateMessage />
        </Card>
      </section>
    </Layout>
  );
}
