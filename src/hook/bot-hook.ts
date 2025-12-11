import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { useQuery } from "@tanstack/react-query";

export function useStaffQuery() {
  return useQuery({
    queryKey: queryKeys.staff(),
    queryFn: async () => handleElysia(await rpc.api.bot.staff.get()),
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news(),
    queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
  });
}
