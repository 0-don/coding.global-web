import { Create } from "@sinclair/typebox/value";
import { query } from "@solidjs/router";
import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { createStore } from "solid-js/store";
import { rpc } from "~/lib/rpc";
import { todoInsertSchema } from "~/lib/schema/todo";
import { TODOS_ADD_KEY, TODOS_DELETE_KEY, TODOS_KEY } from "~/utils/cache/keys";

export const serverFnTodos = query(async () => {
  "use server";
  return (await rpc.api.todo.get()).data!;
}, TODOS_KEY);

export const serverFnTodoAdd = query(
  async (args: typeof todoInsertSchema.static) => {
    "use server";
    return (await rpc.api.todo.post(args)).data!;
  },
  TODOS_ADD_KEY,
);

export const serverFnTodoDelete = query(async (id: string) => {
  "use server";
  return (await rpc.api.todo[id].delete()).data!;
}, TODOS_DELETE_KEY);

export const TodoHook = () => {
  const queryClient = useQueryClient();
  const [todo, setTodo] = createStore(Create(todoInsertSchema));

  const todosQuery = createQuery(() => ({
    queryKey: [TODOS_KEY],
    queryFn: async () => await serverFnTodos(),
  }));

  const todoAdd = createMutation(() => ({
    mutationFn: async () => serverFnTodoAdd(todo),
    onSuccess: (todo) => {
      setTodo(Create(todoInsertSchema));
      queryClient.setQueryData<typeof todosQuery.data>(
        [TODOS_KEY],
        (oldQueryData = []) => [...oldQueryData, todo],
      );
    },
  }));

  const todoDelete = createMutation(() => ({
    mutationFn: async (id: string) => serverFnTodoDelete(id),
    onSuccess: (id) => {
      queryClient.setQueryData<typeof todosQuery.data>(
        [TODOS_KEY],
        (oldQueryData = []) => oldQueryData.filter((todo) => todo.id !== id),
      );
    },
  }));

  return { todosQuery, todoAdd, todoDelete, todo, setTodo };
};
