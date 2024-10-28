import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { showToast } from "~/components/ui/toast";
import { rpc } from "~/lib/client-rpc";
import { CommentInsertSimple, CommentSelect } from "~/server/comment/schema";
import { handleEden } from "~/utils/base";

export const CommentHook = () => {
  const queryClient = useQueryClient();

  const commentsQuery = createQuery(() => ({
    queryKey: ["comments"],
    deferStream: true,
    enabled: false,
    queryFn: async () => {
      const res = await rpc.api.comment.get();
      const result = handleEden(res);
      return result;
    },
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: CommentInsertSimple) =>
      handleEden(await rpc.api.comment.post(args)),
    onSuccess: (newComment) => {
      queryClient.setQueryData<typeof commentsQuery.data>(
        ["comments"],
        (oldQueryData = []) => [...oldQueryData, newComment],
      );
    },
    onError: (error) => {
      const err = JSON.parse(error.message).errors as Error[];

      for (const { message } of err) {
        showToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
  }));

  const commentDelete = createMutation(() => ({
    mutationFn: async (id: string) =>
      handleEden(await rpc.api.comment[id].delete()),
    onSuccess: (c) => {
      queryClient.setQueryData<CommentSelect[]>(
        ["comments"],
        (oldQueryData = []) =>
          oldQueryData.filter((comment) => comment.id !== c?.id),
      );
    },
    onError: (error) => {
      const err = JSON.parse(error.message).errors as Error[];

      for (const { message } of err) {
        showToast({
          title: "Error",
          description: message,
          variant: "destructive",
        });
      }
    },
  }));

  return { commentsQuery, commentAdd, commentDelete };
};
