import { Create } from "@sinclair/typebox/value";
import { cache } from "@solidjs/router";
import { createMutation, createQuery } from "@tanstack/solid-query";
import { For, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { Layout } from "~/components/container/layout";
import Todo from "~/components/Todo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { rpc } from "~/lib/rpc";
import { todoInsertSchema, todoSchemas } from "~/lib/schema/todo";
import { clientEnv } from "~/utils/env/client";

const todos = cache(async () => {
  "use server";
  return (await rpc.api.todo.get()).data!;
}, "todo");

export const route = {
  load: () => todos(),
};

export default function Demo() {
  const [todo, setTodo] = createStore(Create(todoInsertSchema));

  const todoQuery = createQuery(() => ({
    queryKey: ["todo"],
    deferStream: true,
    experimental_prefetchInRender: true,
    queryFn: async () => await todos(),
  }));

  const todoAdd = createMutation(() => ({
    mutationFn: async () => await rpc.api.todo.post(todo),
    onSuccess: () => setTodo(Create(todoInsertSchema)),
  }));

  return (
    <Layout>
      <Card class={"mx-auto p-4 text-center text-gray-700"}>
        <Button>{clientEnv.HOST_URL}</Button>
        <Show when={todoQuery.data}>
          {(todoList) => (
            <For each={todoList()}>
              {(todo) => (
                <div class={"mb-2"}>
                  <Todo id={todo.id} data={todo.data} />
                </div>
              )}
            </For>
          )}
        </Show>
        <br />
        <div class={"flex flex-row justify-center gap-4"}>
          <input
            class={"rounded border-2 border-black px-2 py-1"}
            type={"text"}
            value={todo.data}
            onInput={({ currentTarget: { value: data } }) => setTodo({ data })}
            onKeyUp={({ key }) => {
              if (
                key === "Enter" &&
                !todoAdd.isPending &&
                todoSchemas.insert.safeParse(todo).success
              )
                todoAdd.mutate();
            }}
          />
          <button
            class={
              "rounded border-2 border-black bg-gray-300 px-4 transition-all hover:bg-gray-400 active:bg-gray-400 disabled:cursor-not-allowed disabled:bg-gray-400"
            }
            disabled={
              todoAdd.isPending || !todoSchemas.insert.safeParse(todo).success
            }
            onClick={() => todoAdd.mutate()}
          >
            Submit
          </button>
        </div>
        <br />
        <pre>DrizzleORM + Bun + ElysiaJS + SolidStart + Tailwind CSS</pre>
      </Card>
    </Layout>
  );
}
