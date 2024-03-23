import { signIn } from "@solid-mediakit/auth/client";
import { TbLoader, TbTrashXFilled } from "solid-icons/tb";
import { For, createSignal } from "solid-js";
import { JSX } from "solid-js/web/types/jsx";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useI18nContext } from "~/i18n/i18n-solid";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";

export default function Chat() {
  const { LL } = useI18nContext();
  const { commentAdd, commentsQuery, commentDelete } = CommentHook();
  const [content, setContent] = createSignal("");

  const handleSubmit: JSX.IntrinsicElements["form"]["onsubmit"] = async (e) => {
    e.preventDefault();
    await commentAdd.mutateAsync({ content: content() });
  };

  return (
    <Layout>
      <section class="container mx-auto">
        <For each={commentsQuery.data}>
          {(comment) => (
            <div class="flex w-64 items-center justify-between truncate">
              <span>{comment.content}</span>
              <TbTrashXFilled
                class="cursor-pointer hover:text-red-500"
                onClick={() => commentDelete.mutateAsync(comment.id)}
              />
            </div>
          )}
        </For>
        <form onSubmit={handleSubmit}>
          <Grid class="gap-4">
            <Grid class="gap-1">
              <Label class="sr-only" for="content">
                Comment
              </Label>
              <Input
                value={content()}
                onInput={(e) => setContent(e.currentTarget.value)}
                id="content"
                type="text"
                placeholder="write your comment"
              />
            </Grid>

            <Button type="submit" disabled={commentAdd.isPending}>
              {commentAdd.isPending && (
                <TbLoader class="mr-2 size-4 animate-spin" />
              )}
              {LL().HI()}
            </Button>
          </Grid>
        </form>
        <Button onClick={() => signIn("discord")}>Login</Button>
      </section>
    </Layout>
  );
}
