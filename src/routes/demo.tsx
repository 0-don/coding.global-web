import { For, Show } from "solid-js";
import { Layout } from "~/components/container/layout";
import { prefetchQuery, TodoHook } from "~/components/hook/todo-hook";
import Todo from "~/components/Todo";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { todoSchemas } from "~/lib/schema/todo";
import { clientEnv } from "~/utils/env/client";

export const route = {
  load: () => prefetchQuery(),
};

export default function Demo() {
  const { todo, setTodo, todoAdd, todoQuery } = TodoHook();

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
