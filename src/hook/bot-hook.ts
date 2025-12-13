import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { useQuery } from "@tanstack/react-query";

export function useTeamQuery() {
  return useQuery({
    queryKey: queryKeys.team(),
    queryFn: async () => handleElysia(await rpc.api.bot.team.get()),
  });
}

export function useNewsQuery() {
  return useQuery({
    queryKey: queryKeys.news(),
    queryFn: async () => handleElysia(await rpc.api.bot.news.get()),
  });
}

export function useDiscordWidget() {
  return useQuery({
    queryKey: queryKeys.discordWidget(),
    queryFn: async () => handleElysia(await rpc.api.bot.widget.get()),
  });
}
