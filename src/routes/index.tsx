import { Layout } from '../components/container/Layout';
import { ArrowLink } from '../components/links/ArrowLink';
import { UnderlineLink } from '../components/links/UnderlineLink';
import { UnstyledLink } from '../components/links/UnstyledLink';
import { TitleDescription } from '../components/seo/TitleDescription';

export default function Home() {
  return (
    <>
      <TitleDescription
        title='Coding Discord'
        description='discord.gg/coding official discord'
      />

      <Layout>
        <div class='my-2 flex w-full flex-col items-center justify-center text-center lg:min-h-screen'>
          <UnstyledLink href='https://discord.gg/coding'>
            <div class='flex h-28 items-center rounded-full bg-white p-2 text-6xl font-medium leading-[0px]'>
              <span class='text-red-600'>{'<'}</span>
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
            <ArrowLink href='https://github.com/Don-Cryptus/discord.global-web'>
              See the repository
            </ArrowLink>
          </p>
          <div class='mt-4 flex flex-wrap items-center space-x-2'>
            <UnstyledLink
              href='https://discord.gg/coding'
              className='w-36 rounded-md bg-discord px-2 py-1 text-2xl font-black'
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
            </UnstyledLink>
          </div>
          <div class='mt-2 flex space-x-2'>
            <UnstyledLink
              href='/team'
              className='cursor-newtab w-32 rounded-md bg-discord py-1 text-2xl font-black'
            >
              Team
            </UnstyledLink>
            <UnstyledLink
              href='/rules'
              className='cursor-newtab w-32 rounded-md bg-discord py-1 text-2xl font-black'
            >
              Rules
            </UnstyledLink>
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

          <footer class='text-white tall:absolute tall:bottom-0'>
            <span>{`© ${new Date().getFullYear()} By `}</span>
            <UnderlineLink href='https://github.com/Don-Cryptus'>
              Don Cryptus
            </UnderlineLink>
          </footer>
        </div>
      </Layout>
    </>
  );
}
