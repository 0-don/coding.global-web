import { Staff } from "~/types";
import { Layout } from "../components/container/Layout";
import { Header } from "../components/elements/Header";
import { TitleDescription } from "../components/seo/TitleDescription";
import { createSignal } from "solid-js";
import { onMount } from "solid-js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export default function Team() {
  const [members, setMembers] = createSignal<Staff[]>([]);

  onMount(async () => {
    const res = await fetch(
      "https://bot.coding.global/api/693908458986143824/staff",
    );
    const data: Staff[] = await res.json();
    console.log(data);
    setMembers(data);
  });

  return (
    <>
      <TitleDescription title="Team" description="Coding discord Team" />

      <Layout>
        <section class="bg-dark-light container mx-auto rounded-md bg-opacity-80 text-white">
          <Header name="Team" />

          <div class="mt-10 gap-10 md:grid md:grid-cols-3">
            {members().map((m) => (
              <div class="">
                <Card class="">
                  <CardHeader>
                    <img
                      src={m.avatarUrl}
                      class="rounded-full"
                      alt={m.username}
                      height={100}
                      width={100}
                    />
                    <CardDescription>{m.username}</CardDescription>
                    <CardDescription>{m.staffRoles}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CardTitle>{m.guildName}</CardTitle>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
