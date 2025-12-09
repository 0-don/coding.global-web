import { PAGEABLE_LIMIT } from "@/lib/config/constants";
import { Todo, todoInsertSchema } from "@/lib/db-schema/todo-db-schema";
import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { handleError } from "@/lib/utils/client";
import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

export function useTodosInfiniteQuery() {
  return useInfiniteQuery({
    queryKey: queryKeys.todos(),
    queryFn: async ({ pageParam }) =>
      handleElysia(
        await rpc.api.todo.get({
          $query: { cursor: pageParam, limit: PAGEABLE_LIMIT },
        }),
      )!,
    initialPageParam: null as string | undefined | null,
    getNextPageParam: (lastPage) => {
      const lastItem = lastPage[lastPage.length - 1];
      return lastItem?.createdAt
        ? new Date(lastItem.createdAt).toISOString()
        : null;
    },
  });
}

export function useTodoAddMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: typeof todoInsertSchema.static) =>
      handleElysia(await rpc.api.todo.post(args))!,
    onSuccess: (newTodo) => {
      queryClient.setQueryData(
        queryKeys.todos(),
        (
          oldData: InfiniteData<Todo[]> | undefined,
        ): InfiniteData<Todo[]> | undefined => {
          if (!oldData?.pages) return oldData;
          return {
            pages: [[newTodo as Todo], ...oldData.pages],
            pageParams: [new Date().toISOString(), ...oldData.pageParams],
          };
        },
      );
      toast.success(t("TODO.SUCCESS.TODO_ADD"));
    },
    onError: (e) => handleError(e, t),
  });
}

export function useTodoDeleteMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await rpc.api.todo[id].delete();
      if (response.error) throw response.error;
      return response.data!;
    },
    onSuccess: (id) => {
      queryClient.setQueryData(
        queryKeys.todos(),
        (
          oldData: InfiniteData<Todo[]> | undefined,
        ): InfiniteData<Todo[]> | undefined => {
          if (!oldData?.pages) return oldData;
          const newPages = oldData.pages.map((page) =>
            page.filter((todo) => todo.id !== id),
          );
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
  });
}

export function useTodoSeedMutation() {
  const t = useTranslations();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await rpc.api.todo.seed.get();
      if (response.error) throw response.error;
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.todos() });
      toast.success(t("TODO.SUCCESS.TODO_SEED"));
    },
    onError: (e) => handleError(e, t),
  });
}
