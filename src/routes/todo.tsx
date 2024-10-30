import { RouteDefinition } from "@solidjs/router";
import { For, Show } from "solid-js";
import { Layout } from "~/components/container/layout";
import { prefetchTodos, TodoHook } from "~/components/hook/todo-hook";
import { Card } from "~/components/ui/card";
import { todoSchemas } from "~/lib/schema/todo";

export const route = {
  preload: () => prefetchTodos(),
} satisfies RouteDefinition;

export default function Demo() {
  const { todo, setTodo, todoAdd, todosQuery, todoDelete } = TodoHook();

  return (
    <Layout>
      <Card class={"mx-auto p-4 text-center text-gray-700"}>
        <Show when={todosQuery.data}>
          {(todoList) => (
            <For each={todoList()}>
              {(todo) => (
                <div class={"mb-2"}>
                  <div class={"flex flex-row justify-center gap-4"}>
                    <pre>{todo.data}</pre>
                    <button
                      class={
                        "rounded border-2 border-black bg-red-300 px-4 transition-all hover:bg-red-400 active:bg-red-400 disabled:cursor-not-allowed disabled:bg-red-400"
                      }
                      disabled={todoDelete.isPending}
                      onClick={() => todoDelete.mutate(todo.id)}
                    >
                      X
                    </button>
                  </div>
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
