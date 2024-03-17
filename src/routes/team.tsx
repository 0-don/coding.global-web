import {
  RouteDefinition,
  RouteSectionProps,
  createAsync,
} from "@solidjs/router";
import { AiOutlineGlobal, AiOutlineUserAdd } from "solid-icons/ai";
import { For, Show } from "solid-js";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import { getStaffMembers } from "~/lib/api";
import { STAFF_MEMBERS } from "~/lib/staffMembers";
import { Header } from "../components/container/header";
import { Layout } from "../components/container/layout";

export const route = {
  load: ({ params }) => void getStaffMembers(),
} satisfies RouteDefinition;

export default function Team(props: RouteSectionProps) {
  const members = createAsync(() => getStaffMembers(), {
    deferStream: true,
  });

  return (
    <Layout>
      <section class="container mx-auto">
        <Header name="Team" />

        <div class="mt-10 gap-5 md:grid md:grid-cols-5">
          <For each={members()}>
            {(m) => (
              <Card class="min-h-64">
                <CardHeader>
                  <img
                    src={m.displayAvatarURL}
                    class="h-52 w-full object-cover"
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
                            class={`flex items-center gap-1 ${role.color} `}
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
      </section>
    </Layout>
  );
}
