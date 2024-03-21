import { SubmitHandler, createForm } from "@modular-forms/solid";
import { Create } from "@sinclair/typebox/value";
import { TbLoader } from "solid-icons/tb";
import { For } from "solid-js";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CommentHook } from "~/lib/hook/comment-hook";
import { Layout } from "../components/container/layout";
import {
  CommentInsertSimple,
  commentInsertSimpleSchema,
} from "./api/comment/schema";

export default function Chat() {
  const comment = CommentHook();
  const [authForm, { Form, Field }] = createForm({
    initialValues: Create(commentInsertSimpleSchema),
  });

  const handleSubmit: SubmitHandler<CommentInsertSimple> = async (values) => {
    await comment.commentAdd.mutateAsync(values);
  };

  return (
    <Layout>
      <section class="container mx-auto">
        <For each={comment.commentsQuery.data}>
          {(comment) => <div>{comment.content}</div>}
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
              Add Comment
            </Button>
          </Grid>
        </Form>
      </section>
    </Layout>
  );
}