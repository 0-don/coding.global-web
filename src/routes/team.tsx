import { Layout } from '../components/container/Layout';
import { Header } from '../components/elements/Header';
import MemberDisplay from '../components/elements/MemberDisplay';
import { teamMembers } from '../utils/teamMembers';

export default function Team() {
  return (
    <>
      <Layout>
        <section class='container mx-auto my-10 rounded-md bg-dark-light bg-opacity-80 p-10 text-white'>
          <Header name='Team' />

          <div class='mt-10 grid grid-cols-3 justify-evenly'>
            {teamMembers.map((m) => (
              <MemberDisplay unresolvedMember={m} />
            ))}
          </div>
        </section>
      </Layout>
    </>
  );
}
