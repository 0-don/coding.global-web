import { queryKeys } from "@/lib/react-query/keys";
import { handleElysia } from "@/lib/utils/base";
import { getApiByGuildIdNews, getApiByGuildIdStaff } from "@/openapi";
import { useQuery } from "@tanstack/react-query";

export function useStaffQuery() {
  return useQuery({
    queryKey: queryKeys.staff(),
    queryFn: async () =>
      handleElysia(
        await getApiByGuildIdStaff(process.env.NEXT_PUBLIC_GUILD_ID),
      ),
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news(),
    queryFn: async () =>
      handleElysia(await getApiByGuildIdNews(process.env.NEXT_PUBLIC_GUILD_ID)),
  });
}
