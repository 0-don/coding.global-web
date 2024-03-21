import { SubmitHandler, createForm } from "@modular-forms/solid";
import { Create } from "@sinclair/typebox/value";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { TbLoader } from "solid-icons/tb";
import { For } from "solid-js";
import { rpc } from "~/app";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { handleEden } from "~/utils";
import { Layout } from "../components/container/layout";
import {
  CommentInsertSimple,
  commentInsertSimpleSchema,
} from "./api/comment/schema";

export default function Chat() {
  const [authForm, { Form, Field }] = createForm({
    initialValues: Create(commentInsertSimpleSchema),
  });

  const { data: comments } = createQuery(() => ({
    queryKey: ["comments"],
    queryFn: async () => handleEden(await rpc.api.comment.get()),
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: CommentInsertSimple) =>
      handleEden(await rpc.api.comment.post(args)),
  }));

  const handleSubmit: SubmitHandler<CommentInsertSimple> = async (values) => {
    const newComment = await commentAdd.mutateAsync(values);

    console.log(newComment);
  };

  return (
    <Layout>
      <section class="container mx-auto">
        <For each={comments}>
          {(comment) => (
            <div>
              <p>{comment.content}</p>
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
              Login
            </Button>
          </Grid>
        </Form>
      </section>
    </Layout>
  );
}
