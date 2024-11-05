import { Create } from "@sinclair/typebox/value";
import { query } from "@solidjs/router";
import {
  createInfiniteQuery,
  createMutation,
  InfiniteData,
  useQueryClient,
} from "@tanstack/solid-query";
import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { toast } from "solid-sonner";
import { rpc } from "~/lib/rpc";
import { Todo, todoInsertSchema } from "~/lib/schema/todo";
import { Pageable } from "~/lib/typebox/pageable";
import { handleEden } from "~/utils/base";
import { TODOS_DELETE_KEY, TODOS_KEY } from "~/utils/cache/keys";
import { handleError } from "~/utils/client";
import { useLanguage } from "../provider/language-provider";

export const serverFnTodos = query(async ($query: Pageable = {}) => {
  "use server";
  return handleEden(await rpc.api.todo.get({ $query }));
}, TODOS_KEY);

export const serverFnTodoDelete = query(async (id: string) => {
  "use server";
  return handleEden(await rpc.api.todo[id].delete());
}, TODOS_DELETE_KEY);

export const TodoHook = () => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [todo, setTodo] = createStore(Create(todoInsertSchema));

  const todosInfiniteQuery = createInfiniteQuery(() => ({
    queryKey: [TODOS_KEY],
    queryFn: async ({ pageParam }) => {
      const res = await rpc.api.todo.get({
        $query: { cursor: pageParam },
      });

      if (res.error) {
        handleError(res.error, t);
        return [];
      }

      return res.data!;
    },
    initialPageParam: null as string | undefined | null,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt
        ? new Date(lastItem.createdAt).toISOString()
        : null;
    },
    enabled: false,
  }));

  onMount(() => {
    todosInfiniteQuery.refetch();
  });

  const todoAdd = createMutation(() => ({
    mutationFn: async () => handleEden(await rpc.api.todo.post(todo))!,
    onSuccess: (newTodo) => {
      setTodo(Create(todoInsertSchema));
      queryClient.setQueryData(
        [TODOS_KEY],
        (oldData: InfiniteData<Todo[]>): InfiniteData<Todo[]> => {
          if (!oldData?.pages) return oldData;

          return {
            pages: [[newTodo], ...oldData.pages],
            pageParams: [new Date().toISOString(), ...oldData.pageParams],
          };
        },
      );
      toast.success(t("TODO.SUCCESS.TODO_ADD"));
    },
    onError: (e) => handleError(e, t),
  }));

  const todoDelete = createMutation(() => ({
    mutationFn: async (id: string) => serverFnTodoDelete(id),
    onSuccess: (id) => {
      queryClient.setQueryData(
        [TODOS_KEY],
        (oldData: InfiniteData<Todo[]>): InfiniteData<Todo[]> => {
          if (!oldData?.pages) return oldData;

          // Filter out the deleted todo from all pages
          const newPages = oldData.pages.map((page) =>
            page.filter((todo) => todo.id !== id),
          );

          // Remove any empty pages
          const filteredPages = newPages.filter((page) => page.length > 0);

          return {
            pages: filteredPages,
            pageParams: oldData.pageParams.slice(0, filteredPages.length),
          };
        },
      );
      toast.error(t("TODO.INFO.TODO_DELETED"));
    },
    onError: (e) => handleError(e, t),
  }));

  return {
    todosInfiniteQuery,
    todoAdd,
    todoDelete,
    todo,
    setTodo,
  };
};
