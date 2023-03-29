import { Layout } from '../components/container/Layout';
import { ArrowLink } from '../components/links/ArrowLink';
import { UnstyledLink } from '../components/links/UnstyledLink';


export default function Home() {
  return (
    <Layout>
      <main>
        <section class='text-white'>
          <div class='layout flex min-h-screen flex-col items-center justify-center text-center'>
            <UnstyledLink href='https://discord.gg/coding'>
              <div class='mt-5 rounded-full bg-white px-1 py-5 pb-8 text-6xl font-medium md:mt-0'>
                <span class='mb-10 text-red-600'>{'<'}</span>
                <span class='text-black'>/</span>
                <span class='text-red-600'>{'>'}</span>
              </div>
            </UnstyledLink>
            <h1 class='mt-4'>Official Coding Discord Website</h1>
            <p class='mt-2 text-sm text-white'>
              Official{' '}
              <ArrowLink className='underline' href='https://discord.gg/coding'>
                discord.gg/coding
              </ArrowLink>
              Website for the Coding Discord Server
            </p>
            <p class='mt-2 text-sm text-white'>
              <a href='https://github.com/Don-Cryptus/discord.global-web'>
                See the repository
              </a>
            </p>
            <div class='mt-4 flex items-center space-x-2'>
              <a
                href='https://discord.gg/coding'
                class='bg-discord w-36 rounded-md px-2 py-1 text-2xl font-black'
              >
                <div class='flex items-center'>
                  <img
                    class='mt-0.5 px-1'
                    src='/images/discord.png'
                    width='31'
                    height='24'
                    alt='Discord Logo'
                  />
                  <span>Discord</span>
                </div>
              </a>
              <a
                href='/faq'
                class='cursor-newtab bg-discord w-32 rounded-md py-1 text-2xl font-black'
              >
                FAQ
              </a>
            </div>
            <div class='mt-4 flex items-center space-x-2'>
              <a
                href='/rules'
                class='cursor-newtab bg-discord w-32 rounded-md py-1 text-2xl font-black'
              >
                Rules
              </a>
              <a
                href='/team'
                class='cursor-newtab bg-discord w-32 rounded-md py-1 text-2xl font-black'
              >
                Team
              </a>
              <a
                href='/bot'
                class='cursor-newtab bg-discord w-32 rounded-md py-1 text-2xl font-black'
              >
                Bots
              </a>
            </div>
            <iframe
              src='https://discord.com/widget?id=693908458986143824&theme=dark'
              width='350'
              height='500'
              title='Discord Widget'
              frame-border='0'
              class='mt-4'
              sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
            ></iframe>

            {/* <ButtonLink class='mt-6' href='/components' variant='light'>
              See all components
            </ButtonLink> */}

            {/* <UnstyledLink
              href='https://vercel.com/new/git/external?repository-url=https%3A%2F%2Fgithub.com%2Ftheodorusclarence%2Fts-nextjs-tailwind-starter'
              class='mt-4'
            >
               eslint-disable-next-line @next/next/no-img-element 
              <img
                width='92'
                height='32'
                src='https://vercel.com/button'
                alt='Deploy with Vercel'
              />
            </UnstyledLink> */}

            <footer class='bottom-2 text-white md:absolute '>
              © {new Date().getFullYear()} By{' '}
              <a href='https://github.com/Don-Cryptus'>Don Cryptus</a>
              {' & '}
              <a href='https://github.com/Bit-Barron'>Barron</a>
              {' & '}
              <a href='https://github.com/Superriot'>Superriot</a>
            </footer>
          </div>
        </section>
      </main>
    </Layout>
  );
}
