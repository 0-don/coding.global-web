import { useAuth } from "@solid-mediakit/auth/client";
import { TbTrashXFilled } from "solid-icons/tb";
import { Component, For, Show } from "solid-js";
import { ChatHook } from "~/components/hook/chat-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Image, ImageFallback, ImageRoot } from "~/components/ui/image";

interface ChatMessagesProps {
  class?: string;
}

export const ChatMessages: Component<ChatMessagesProps> = (props) => {
  const { locale } = useLanguage();
  const { commentsQuery, commentDelete } = ChatHook();
  const auth = useAuth();

  return (
    <div class={props.class}>
      <For each={commentsQuery.data}>
        {(comment) => {
          const username = comment.user?.name || comment.user?.globalName!;
          return (
            <div class="group my-2 flex w-full space-x-2 rounded-md p-1 hover:bg-zinc-200 hover:dark:bg-stone-900/20">
              <ImageRoot>
                <Image
                  src={`data:image/*;base64,${comment.user?.image}`}
                  alt={username}
                />
                <ImageFallback>
                  {username.slice(0, 2).toUpperCase()}
                </ImageFallback>
              </ImageRoot>
              <div class="relative w-full">
                <div class="flex cursor-default items-center space-x-2">
                  <p class="font-bold">{comment.user?.name}</p>
                  <p class="text-sm text-muted-foreground">
                    {new Date(comment.createdAt!).toLocaleString(locale())}
                  </p>
                </div>
                <div>
                  <p class="break-all">{comment?.content}</p>
                  <Show when={comment?.user?.id === auth.session()?.user?.id}>
                    <TbTrashXFilled
                      class="absolute right-1 top-1 hidden cursor-pointer hover:text-red-500 group-hover:block"
                      onClick={() => commentDelete.mutateAsync(comment.id)}
                    />
                  </Show>
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
