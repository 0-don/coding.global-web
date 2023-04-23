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
        <div class='flex h-full w-full flex-col items-center text-center'>
          <UnstyledLink className='mt-auto' href='https://discord.gg/coding'>
            <div
              class={`' flex h-36 w-36 items-center justify-center rounded-full`}
            >
              <img src='/images/logo_512.gif' />
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
            class='mt-4 flex-shrink-0'
            sandbox='allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts'
          ></iframe>

          <footer class='mt-auto text-white'>
            <span>{`© ${new Date().getFullYear()} By `}</span>
            <UnderlineLink href='https://github.com/Don-Cryptus'>
              Don Cryptus
            </UnderlineLink>
            <span> & </span>
            <UnderlineLink href='https://github.com/kryptn36'>
              kryptn36
            </UnderlineLink>
          </footer>
        </div>
      </Layout>
    </>
  );
}
