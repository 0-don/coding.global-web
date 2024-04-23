import { createSession } from "@solid-mediakit/auth/client";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { TbTrashXFilled } from "solid-icons/tb";
import { Component, For, Show } from "solid-js";
import { CommentHook } from "~/components/hook/comment-hook";

dayjs.extend(localizedFormat);

interface ChatMessagesProps {
  class?: string;
}

export const ChatMessages: Component<ChatMessagesProps> = (props) => {
  const { commentsQuery, commentDelete } = CommentHook();
  const session = createSession();

  return (
    <div class={props.class}>
      <For each={commentsQuery.data}>
        {(comment) => (
          <div class="group my-2 flex w-full items-center space-x-2 truncate rounded-md p-1 hover:bg-zinc-200 hover:dark:bg-stone-900/20">
            <Show when={comment?.user?.image}>
              {(img) => <img class="h-14 rounded-full" src={img()} />}
            </Show>
            <div class="relative w-full">
              <div class="flex cursor-default items-center space-x-2">
                <p class="font-bold">{comment.user?.name}</p>
                <p class="text-sm text-muted-foreground">
                  {dayjs(comment.createdAt).format("L LT")}
                </p>
              </div>
              <div>
                <p>{comment.content}</p>
                <Show when={comment?.user?.id === session()?.user?.me.id}>
                  <TbTrashXFilled
                    class="absolute right-0 top-0 hidden cursor-pointer hover:text-red-500 group-hover:block"
                    onClick={() => commentDelete.mutateAsync(comment.id)}
                  />
                </Show>
              </div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
