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

  const commentsQuery = createQuery(() => ({
    queryKey: ["comments"],
    queryFn: async () => handleEden(await rpc.api.comment.get()),
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
      console.log("test", JSON.parse(JSON.stringify(error)).errors);
      console.log("xxx", error.message);
      // for (const description of error.message) {
      //   console.error(description);
      //   showToast({
      //     title: "Error",
      //     description,
      //     variant: "destructive",
      //   });
      // }
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
  }));

  return { commentsQuery, commentAdd, commentDelete };
};
