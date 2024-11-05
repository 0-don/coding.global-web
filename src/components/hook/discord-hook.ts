import { query } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { getStaff, getNews } from "~/lib/openapi";
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
  const staffMembersQuery = createQuery(() => ({
    queryKey: [STAFF_MEMBERS_KEY],
    queryFn: async () => serverFnStaffMembers(),
  }));

  const newsQuery = createQuery(() => ({
    queryKey: [NEWS_KEY],
    queryFn: async () => serverFnNews(),
  }));

  return { staffMembersQuery, newsQuery };
};
