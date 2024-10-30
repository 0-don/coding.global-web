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

export const prefetchQuery = cache(async () => {
  "use server";
  return (await rpc.api.todo.get()).data!;
}, "todo");

export const TodoHook = () => {
  const queryClient = useQueryClient();
  const [todo, setTodo] = createStore(Create(todoInsertSchema));

  const todoQuery = createQuery(() => ({
    queryKey: ["todo"],
    queryFn: async () => await prefetchQuery(),
  }));

  const todoAdd = createMutation(() => ({
    mutationFn: async () => (await rpc.api.todo.post(todo)).data!,
    onSuccess: (todo) => {
      setTodo(Create(todoInsertSchema));
      queryClient.setQueryData<typeof todoQuery.data>(
        ["todo"],
        (oldQueryData = []) => [...oldQueryData, todo],
      );
    },
  }));

  const todoDelete = createMutation(() => ({
    mutationFn: async (id: string) => await rpc.api.todo({ id }).delete(),
  }));

  return { todoQuery, todoAdd, todoDelete, todo, setTodo };
};
