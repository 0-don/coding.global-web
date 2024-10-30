import { cache } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { STAFF_MEMBERS_KEY } from "~/utils/cache/keys";
import { serverEnv } from "~/utils/env/server";
import { Staff } from "~/utils/types";

const prefetchStaffMembers = cache(async () => {
  "use server";
  return (await fetch(serverEnv.STAFF_MEMERS_URL).then((res) =>
    res.json(),
  )) as Staff[];
}, STAFF_MEMBERS_KEY);

export const DiscordHook = () => {
  const staffMembersQuery = createQuery(() => ({
    queryKey: [STAFF_MEMBERS_KEY],
    queryFn: async () => await prefetchStaffMembers(),
  }));

  return { staffMembersQuery };
};
