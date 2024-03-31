import { signIn } from "@solid-mediakit/auth/client";
import { FaBrandsDiscord } from "solid-icons/fa";
import { JSX, Show, createSignal } from "solid-js";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CommentHook } from "~/lib/hook/comment-hook";
import { SessionHook } from "~/lib/hook/session-hook";

interface CreateMessageProps {
  class?: string;
}

export default function CreateMessage(props: CreateMessageProps) {
  const { commentAdd } = CommentHook();
  const [content, setContent] = createSignal("");
  const session = SessionHook();
  const handleSubmit: JSX.IntrinsicElements["form"]["onsubmit"] = async (e) => {
    e.preventDefault();
    await commentAdd.mutateAsync({ content: content() });
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} class={props.class}>
      <Show when={session()}>
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
      <Show when={!session()}>
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
}
