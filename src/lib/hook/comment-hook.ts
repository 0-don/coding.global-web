import {
  createMutation,
  createQuery,
  useQueryClient,
} from "@tanstack/solid-query";
import { rpc } from "~/app";
import {
  CommentInsertSimple,
  CommentSelect,
} from "~/routes/api/comment/schema";
import { handleEden } from "~/utils";

export const CommentHook = () => {
  const queryClient = useQueryClient();

  const { data: comments } = createQuery(() => ({
    queryKey: ["comments"],
    queryFn: async () => handleEden(await rpc.api.comment.get()),
  }));

  const commentAdd = createMutation(() => ({
    mutationFn: async (args: CommentInsertSimple) =>
      handleEden(await rpc.api.comment.post(args)),
    onSuccess: (newComment) => {
      queryClient.setQueryData(
        ["comments"],
        (oldQueryData: CommentSelect[]) => [...oldQueryData, newComment],
      );
    },
  }));

  return { comments, commentAdd };
};
