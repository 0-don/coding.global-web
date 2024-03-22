import { SubmitHandler, createForm } from "@modular-forms/solid";
import { Create } from "@sinclair/typebox/value";
import { signIn } from "@solid-mediakit/auth/client";
import { TbLoader, TbTrashXFilled } from "solid-icons/tb";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useI18nContext } from "~/i18n/i18n-solid";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";
import {
  CommentInsertSimple,
  commentInsertSimpleSchema,
} from "./api/comment/schema";

export default function Chat() {
  const { LL } = useI18nContext();
  const { commentAdd, commentsQuery, commentDelete } = CommentHook();
  const [authForm, { Form, Field }] = createForm({
    initialValues: Create(commentInsertSimpleSchema),
  });

  const handleSubmit: SubmitHandler<CommentInsertSimple> = async (values) => {
    await commentAdd.mutateAsync(values);
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
        <Form onSubmit={handleSubmit}>
          <Grid class="gap-4">
            <Field name="content">
              {(_, props) => (
                <Grid class="gap-1">
                  <Label class="sr-only" for="content">
                    Comment
                  </Label>
                  <Input
                    {...props}
                    id="content"
                    type="text"
                    placeholder="write your comment"
                  />
                </Grid>
              )}
            </Field>
            <Button type="submit" disabled={authForm.submitting}>
              {authForm.submitting && (
                <TbLoader class="mr-2 size-4 animate-spin" />
              )}
              {LL().HI()}
            </Button>
          </Grid>
        </Form>
        <Button onClick={() => signIn()}>Login</Button>
      </section>
    </Layout>
  );
}
