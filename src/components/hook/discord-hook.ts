import { query } from "@solidjs/router";
import { useQuery } from "@tanstack/solid-query";
import { getNews, getStaff } from "~/lib/openapi";
import { NEWS_KEY, STAFF_MEMBERS_KEY } from "~/utils/cache/keys";
import { clientEnv } from "~/utils/env/client";

export const serverFnStaffMembers = query(async () => {
  "use server";
  return (await getStaff(clientEnv.GUILD_ID)).data;
}, STAFF_MEMBERS_KEY);

export const serverFnNews = query(async () => {
  "use server";
  return (await getNews(clientEnv.GUILD_ID)).data;
}, NEWS_KEY);

export const DiscordHook = () => {
  const staffMembersQuery = useQuery(() => ({
    queryKey: [STAFF_MEMBERS_KEY],
    queryFn: async () => serverFnStaffMembers(),
  }));

  const newsQuery = useQuery(() => ({
    queryKey: [NEWS_KEY],
    queryFn: async () => serverFnNews(),
  }));

  return { staffMembersQuery, newsQuery };
};
