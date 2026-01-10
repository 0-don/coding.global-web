import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import type {
  GetApiByGuildIdTopParams,
  GetApiByGuildIdUserSearchParams,
} from "@/openapi";
import { useQuery } from "@tanstack/react-query";

export function useTerminalMembersQuery() {
  return useQuery({
    queryKey: queryKeys.terminalMembers(),
    queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
  });
}

export function useTerminalTopQuery(query?: GetApiByGuildIdTopParams) {
  return useQuery({
    queryKey: queryKeys.terminalTop(query),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.top.get({ query })),
  });
}

export function useTerminalUserSearchQuery(
  query: GetApiByGuildIdUserSearchParams,
) {
  return useQuery({
    queryKey: queryKeys.terminalUserSearch(query),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user.search.get({ query })),
    enabled: query.q.length > 0,
  });
}

export function useTerminalUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.terminalUser(userId),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user({ userId }).get()),
    enabled: userId.length > 0,
  });
}
