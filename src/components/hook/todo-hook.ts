import { Create } from "@sinclair/typebox/value";
import { cache } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { createStore } from "solid-js/store";
import { rpc } from "~/lib/rpc";
import { todoInsertSchema } from "~/lib/schema/todo";

export const prefetchTodos = cache(async () => {
  "use server";
  return (await rpc.api.todo.get()).data!;
}, "todos");

export const TodoHook = () => {
  const queryClient = useQueryClient();
  const [todo, setTodo] = createStore(Create(todoInsertSchema));

  const todosQuery = createQuery(() => ({
    queryKey: ["todos"],
    queryFn: async () => await prefetchTodos(),
  }));

  const todoAdd = createMutation(() => ({
    mutationFn: async () => (await rpc.api.todo.post(todo)).data!,
    onSuccess: (todo) => {
      setTodo(Create(todoInsertSchema));
      queryClient.setQueryData<typeof todosQuery.data>(
        ["todo"],
        (oldQueryData = []) => [...oldQueryData, todo],
      );
    },
  }));

  const todoDelete = createMutation(() => ({
    mutationFn: async (id: string) => await rpc.api.todo({ id }).delete(),
  }));

  return { todosQuery, todoAdd, todoDelete, todo, setTodo };
};
