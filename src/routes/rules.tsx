import { Layout } from '../components/container/Layout';
import { Header } from '../components/elements/Header';
import { TitleDescription } from '../components/seo/TitleDescription';

export default function Rules() {
  return (
    <>
      <TitleDescription title='Rules' description='Coding discord Team' />

      <Layout>
        <section class='container mx-auto my-10 rounded-md bg-dark-light bg-opacity-80 p-10 text-white'>
          <Header name='Rules' />

          <div class='mt-10 grid grid-cols-3 justify-evenly'></div>
        </section>
      </Layout>
    </>
  );
}
