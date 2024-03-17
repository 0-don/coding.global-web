import { Staff } from "~/types";
import { Layout } from "../components/container/Layout";
import { Header } from "../components/elements/Header";
import { TitleDescription } from "../components/seo/TitleDescription";
import { Show, createSignal } from "solid-js";
import { onMount } from "solid-js";
import { Card, CardDescription, CardHeader } from "~/components/ui/card";
import { AiOutlineUserAdd } from "solid-icons/ai";
import { AiOutlineGlobal } from "solid-icons/ai";
import { staffMembers } from "~/utils/staffMembers";
import { For } from "solid-js";

export default function Team() {
  const [members, setMembers] = createSignal<Staff[]>([]);

  onMount(async () => {
    const res = await fetch(
      "https://bot.coding.global/api/693908458986143824/staff",
    );
    const data: Staff[] = await res.json();
    setMembers(data);
  });

  const findRole = (role: string) => {
    return staffMembers.find((member) => member.role === role);
  };

  return (
    <>
      <TitleDescription title="Team" description="Coding discord Team" />

      <Layout>
        <section class="bg-dark-light container mx-auto rounded-md bg-opacity-80 text-white">
          <Header name="Team" />

          <div class="mt-10 gap-10 md:grid md:grid-cols-4">
            {members().map((m) => (
              <div class="">
                <Card class="">
                  <CardHeader>
                    <img
                      src={m.avatarUrl}
                      class="h-52 w-full object-cover"
                      alt={m.username}
                    />
                    <div class="">
                      <Show when={m.globalName}>
                        <CardDescription class="flex space-x-2 font-bold">
                          <AiOutlineGlobal class="mt-1 text-xl" />
                          <span class="text-lg font-bold">{m.globalName}</span>
                        </CardDescription>
                      </Show>
                      <CardDescription class="flex space-x-2 font-bold">
                        <AiOutlineUserAdd class="mt-1 text-xl" />
                        <span class="text-lg">{m.username}</span>
                      </CardDescription>

                      <CardDescription>
                        <For each={m.memberRoles}>
                          {(staffRole) => {
                            const role = findRole(staffRole);
                            if (!role) return null;

                            return (
                              <span
                                class={`flex gap-2 text-lg ${role.color} font-bold`}
                              >
                                <role.Icon class="mt-1 text-xl" />

                                {role.role}
                              </span>
                            );
                          }}
                        </For>
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
