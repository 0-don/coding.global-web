import { Layout } from "../components/container/Layout";
import { Header } from "../components/elements/Header";
import { MemberDisplay } from "../components/elements/MemberDisplay";
import { TitleDescription } from "../components/seo/TitleDescription";
import { teamMembers } from "../utils/teamMembers";

export default function Team() {
  return (
    <>
      <TitleDescription title="Team" description="Coding discord Team" />

      <Layout>
        <section class="bg-dark-light container mx-auto rounded-md bg-opacity-80 text-white">
          <Header name="Team" />

          <div class="mt-10 md:grid md:grid-cols-3 gap-10">
            {teamMembers.map((m) => (
              <MemberDisplay unresolvedMember={m} />
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
