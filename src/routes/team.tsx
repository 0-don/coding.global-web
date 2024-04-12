import { createQuery } from "@tanstack/solid-query";
import {
  AiFillBug,
  AiFillCode,
  AiFillCrown,
  AiOutlineGlobal,
  AiOutlineUserAdd,
} from "solid-icons/ai";
import { CgSupport } from "solid-icons/cg";
import { FiHelpCircle } from "solid-icons/fi";
import { For, Show } from "solid-js";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import { clientEnv } from "~/utils/env/client";
import { Header } from "../components/container/header";
import { Layout } from "../components/container/layout";
import { MemberRole, Staff } from "../utils/types";

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
];

export default function Team() {
  const staff = createQuery<Staff[]>(() => ({
    queryKey: ["staffMembers"],
    queryFn: () => fetch(clientEnv.STAFF_MEMERS_URL).then((res) => res.json()),
  }));

  return (
    <Layout container class="mt-10">
      <Header name="Team" />

      <div class="mt-10 gap-2 md:grid md:grid-cols-6">
        <For each={staff.data}>
          {(m) => (
            <Card class="">
              <CardHeader>
                <img
                  src={m.displayAvatarURL}
                  class="w-full object-cover"
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

                <CardDescription class="flex flex-wrap space-x-2">
                  <For each={m.memberRoles}>
                    {(staffRole) => {
                      const role = STAFF_MEMBERS.find(
                        (member) => member.role === staffRole,
                      );

                      if (!role) return <></>;

                      return (
                        <span
                          class={`flex items-center gap-1 text-xs ${role.color}`}
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
    </Layout>
  );
}
