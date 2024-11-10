import { RouteDefinition } from "@solidjs/router";
import {
  AiFillBug,
  AiFillCode,
  AiFillCrown,
  AiOutlineGlobal,
  AiOutlineUserAdd,
} from "solid-icons/ai";
import { CgSupport } from "solid-icons/cg";
import { FiHelpCircle } from "solid-icons/fi";
import { ImDiamonds } from "solid-icons/im";
import { For, Show } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { MetaHead } from "~/components/elements/meta-head";
import { QueryBoundary } from "~/components/elements/query-boundary";
import {
  DiscordHook,
  serverFnStaffMembers,
} from "~/components/hook/discord-hook";
import { useLanguage } from "~/components/provider/language-provider";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import { cn } from "~/lib/utils";
import { MemberRole } from "~/utils/types";

export const route = {
  preload: () => serverFnStaffMembers(),
} satisfies RouteDefinition;

export default function TeamPage() {
  const { t } = useLanguage();
  const { staffMembersQuery } = DiscordHook();

  return (
    <>
      <MetaHead
        title={t("TEAM.META.TITLE")!}
        description={t("TEAM.META.DESCRIPTION")!}
        keywords={t("TEAM.META.KEYWORDS")}
      />

      <Layout container class="mt-10">
        <Header name="TEAM.TITLE" className="mb-5" />

        <QueryBoundary query={staffMembersQuery}>
          {(staffMembers) => (
            <div class="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
              <For each={staffMembers}>
                {(m) => (
                  <Card>
                    <CardHeader>
                      <img
                        src={m.displayAvatarURL}
                        class="max-h-48 w-full object-cover"
                        alt={m.username}
                      />
                      <CardDescription class="flex items-center space-x-1">
                        <AiOutlineUserAdd />
                        <span>{m.username}</span>
                      </CardDescription>
                      <Show when={m.globalName}>
                        <CardDescription class="flex items-center space-x-1">
                          <AiOutlineGlobal />
                          <span class="font-bold">{m.globalName}</span>
                        </CardDescription>
                      </Show>

                      <CardDescription class="flex flex-wrap gap-2">
                        <For each={m.memberRoles}>
                          {(staffRole) => {
                            const role = STAFF_MEMBERS.find(
                              (member) =>
                                member.role.toLowerCase() ===
                                staffRole.toLowerCase(),
                            );

                            if (!role) return <></>;

                            return (
                              <span
                                class={cn(
                                  `flex items-center gap-1 text-xs`,
                                  role.color,
                                )}
                              >
                                <role.Icon />

                                {role.role}
                              </span>
                            );
                          }}
                        </For>
                      </CardDescription>
                    </CardHeader>
                  </Card>
                )}
              </For>
            </div>
          )}
        </QueryBoundary>
      </Layout>
    </>
  );
}

const STAFF_MEMBERS: MemberRole[] = [
  {
    role: "Owner",
    color: "text-red-500",
    Icon: AiFillCrown,
  },
  {
    role: "Moderator",
    color: "text-green-500",
    Icon: AiFillBug,
  },
  {
    role: "Admin",
    color: "text-yellow-500",
    Icon: AiFillCode,
  },
  {
    role: "Helper",
    color: "text-blue-500",
    Icon: FiHelpCircle,
  },
  {
    role: "Techlead",
    color: "text-orange-500",
    Icon: CgSupport,
  },
  {
    role: "Booster",
    color: "text-pink-600",
    Icon: ImDiamonds,
  },
];
