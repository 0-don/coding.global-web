import { SubmitHandler, createForm } from "@modular-forms/solid";
import { TbLoader } from "solid-icons/tb";
import { Button } from "~/components/ui/button";
import { Grid } from "~/components/ui/grid";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Layout } from "../components/container/layout";

type Message = {
  content: string;
};

export default function Chat() {
  const [authForm, { Form, Field }] = createForm<Message>();

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
                  <Label class="sr-only" for="email">
                    Email
                  </Label>
                  <Input {...props} type="email" placeholder="me@email.com" />
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
