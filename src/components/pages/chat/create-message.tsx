import { createSession, signIn } from "@solid-mediakit/auth/client";
import { FaBrandsDiscord } from "solid-icons/fa";
import { Component, JSX, Show, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CommentHook } from "~/lib/hook/comment-hook";

interface CreateMessageProps {}

export const CreateMessage: Component<CreateMessageProps> = (props) => {
  const { commentAdd } = CommentHook();
  const session = createSession();
  const [content, setContent] = createSignal("");

  const handleSubmit: JSX.IntrinsicElements["form"]["onsubmit"] = async (e) => {
    e.preventDefault();
    await commentAdd.mutateAsync({ content: content() });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <Show when={session()?.user}>
        <Grid class="gap-1">
          <Label class="sr-only" for="content">
            Comment
          </Label>
          <Input
            class="bg-gray-200 focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-zinc-700"
            value={content()}
            onInput={(e) => setContent(e.currentTarget.value)}
            id="content"
            type="text"
            placeholder="write your comment"
          />
        </Grid>
      </Show>
      <Show when={!session()?.user}>
        <Button
          type="button"
          onClick={() => signIn("discord")}
          class="w-full rounded-md bg-discord px-2 py-1 text-2xl font-black hover:bg-discord hover:opacity-90"
        >
          <div class="flex items-center text-white">
            <FaBrandsDiscord />
            <span>Discord Login</span>
          </div>
        </Button>
      </Show>
    </form>
  );
};
