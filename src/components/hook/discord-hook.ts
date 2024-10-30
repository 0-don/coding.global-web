import { cache } from "@solidjs/router";
import { createQuery } from "@tanstack/solid-query";
import { STAFF_MEMBERS_KEY } from "~/utils/cache/keys";
import { clientEnv } from "~/utils/env/client";
import { Staff } from "~/utils/types";

const prefetchStaffMembers = cache(async () => {
  "use server";
  return (await fetch(clientEnv.STAFF_MEMERS_URL).then((res) =>
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
