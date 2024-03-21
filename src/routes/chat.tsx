import { SubmitHandler, createForm } from "@modular-forms/solid";
import { createQuery } from "@tanstack/solid-query";
import { TbLoader } from "solid-icons/tb";
import { rpc } from "~/app";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { handleEden } from "~/utils";
import { Layout } from "../components/container/layout";
import { data } from "tailwindcss/defaultTheme";

type Message = {
  content: string;
};

export default function Chat() {
  const [authForm, { Form, Field }] = createForm<Message>();

  const { data } = createQuery(() => ({
    queryKey: ["comments"],
    queryFn: async () => handleEden(await rpc.api.comment.get()),
  }));

  console.log(data);

  const handleSubmit: SubmitHandler<Message> = () => {
    return new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <Layout>
      <section class="container mx-auto">
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
