import { queryKeys } from "@/lib/react-query/keys";
import { rpc } from "@/lib/rpc";
import { handleElysia } from "@/lib/utils/base";
import { useQuery } from "@tanstack/react-query";

export function useTerminalMembersQuery() {
  return useQuery({
    queryKey: queryKeys.terminalMembers(),
    queryFn: async () => handleElysia(await rpc.api.terminal.members.get()),
  });
}

export function useTerminalTopQuery(options?: { days?: number; limit?: number }) {
  return useQuery({
    queryKey: queryKeys.terminalTop(options?.days, options?.limit),
    queryFn: async () =>
      handleElysia(
        await rpc.api.terminal.top.get({
          query: { days: options?.days, limit: options?.limit },
        }),
      ),
  });
}

export function useTerminalUserSearchQuery(query: string, options?: { limit?: number; enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.terminalUserSearch(query, options?.limit),
    queryFn: async () =>
      handleElysia(
        await rpc.api.terminal.user.search.get({
          query: { q: query, limit: options?.limit },
        }),
      ),
    enabled: options?.enabled ?? query.length > 0,
  });
}

export function useTerminalUserQuery(userId: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: queryKeys.terminalUser(userId),
    queryFn: async () =>
      handleElysia(await rpc.api.terminal.user({ userId }).get()),
    enabled: options?.enabled ?? userId.length > 0,
  });
}
