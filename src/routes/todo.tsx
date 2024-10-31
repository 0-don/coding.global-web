import { RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { prefetchTodos, TodoHook } from "~/components/hook/todo-hook";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { TextField, TextFieldRoot } from "~/components/ui/textfield";
import { todoSchemas } from "~/lib/schema/todo";

export const route = {
  preload: () => prefetchTodos(),
} satisfies RouteDefinition;

export default function Demo() {
  const { todo, setTodo, todoAdd, todosQuery, todoDelete } = TodoHook();

  const onSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    if (!todoAdd.isPending && todoSchemas.insert.safeParse(todo).success)
      todoAdd.mutate();
  };

  return (
    <Layout container>
      <Card class="mt-5">
        <Header name="TODO.TITLE" />
        <Show when={todosQuery.data}>
          {(todoList) => (
            <For each={todoList()}>
              {(todo) => (
                <div class={"flex items-center justify-center gap-4"}>
                  <p>{todo.data}</p>
                  <Button
                    variant="destructive"
                    disabled={todoDelete.isPending}
                    onClick={() => todoDelete.mutateAsync(todo.id)}
                  >
                    X
                  </Button>
                </div>
              )}
            </For>
          )}
        </Show>

        <form onSubmit={onSubmit} class={"flex flex-row justify-center gap-4"}>
          <TextFieldRoot class="w-full max-w-xs" validationState="invalid">
            <TextField
              class={"rounded border-2 px-2 py-1"}
              type={"text"}
              value={todo.data}
              onInput={(e) => setTodo({ data: e.currentTarget.value })}
            />
          </TextFieldRoot>
          <Button
            disabled={
              todoAdd.isPending || !todoSchemas.insert.safeParse(todo).success
            }
            onClick={() => todoAdd.mutate()}
          >
            Submit
          </Button>
        </form>
        <br />
      </Card>
    </Layout>
  );
}
