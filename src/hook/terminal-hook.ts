import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import type {
  GetApiByGuildIdTopParams,
  GetApiByGuildIdUserSearchParams,
} from "@/openapi";
import { useQuery } from "@tanstack/react-query";

/**
 * Usage example:
 *
 * const { refetch: fetchMembers, data, isLoading } = useTerminalMembersQuery();
 *
 * const handleCommand = async (cmd: string) => {
 *   if (cmd === "/stats") {
 *     const result = await fetchMembers();
 *     console.log(result.data);
 *   }
 * };
 */

export function useTerminalMembersQuery() {
  return useQuery({
    queryKey: queryKeys.terminalMembers(),
    queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
    enabled: false,
  });
}

export function useTerminalTopQuery(query?: GetApiByGuildIdTopParams) {
  return useQuery({
    queryKey: queryKeys.terminalTop(query),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.top.get({ query })),
    enabled: false,
  });
}

export function useTerminalUserSearchQuery(
  query?: GetApiByGuildIdUserSearchParams,
) {
  return useQuery({
    queryKey: queryKeys.terminalUserSearch(query),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user.search.get({ query })),
    enabled: false,
  });
}

export function useTerminalUserQuery(userId: string) {
  return useQuery({
    queryKey: queryKeys.terminalUser(userId),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user({ userId }).get()),
    enabled: false,
  });
}
