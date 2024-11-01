import { A } from "@solidjs/router";
import { FaBrandsDiscord } from "solid-icons/fa";
import { useLanguage } from "~/components/provider/language-provider";
import { Layout } from "../components/container/layout";

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <Layout>
      <div class="flex size-full flex-col items-center text-center">
        <A class="mt-auto" href="https://discord.gg/coding">
          <div class="mt-2 size-36">
            <img src="/images/logo_512.gif" class="rounded-full" />
          </div>
        </A>
        <h1 class="mt-4">Official Coding Discord Website</h1>
        <p class="mt-2 text-sm">
          Official{" "}
          <A class="underline" href="https://discord.gg/coding">
            discord.gg/coding
          </A>
          Website for the Coding Discord Server
        </p>
        <p class="mt-2 text-sm">
          <A href="https://github.com/0-don/coding.global-web">
            See the repository
          </A>
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-2">
          <A
            href="https://discord.gg/coding"
            target="_blank"
            class="w-36 rounded-md bg-discord px-2 py-1 text-2xl font-black"
          >
            <div class="flex items-center gap-1">
              <FaBrandsDiscord />
              <span>Discord</span>
            </div>
          </A>
          <A
            href="https://disboard.org/server/693908458986143824"
            target="_blank"
            class="w-36 rounded-md bg-discord px-2 py-1 text-2xl font-black"
          >
            <div class="flex items-center gap-1">
              <img
                src="/images/disboard.jpg"
                alt="disboard"
                class="size-5 rounded-full"
              />
              <span>Disboard</span>
            </div>
          </A>
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-2">
          <A
            href="/team"
            class="w-32 rounded-md bg-discord py-1 text-2xl font-black text-white"
          >
            Team
          </A>
          <A
            href="/rules"
            class="w-32 rounded-md bg-discord py-1 text-2xl font-black text-white"
          >
            Rules
          </A>
          <A
            href="/chat"
            class="w-32 rounded-md bg-discord py-1 text-2xl font-black text-white"
          >
            Chat
          </A>
          <A
            href="/todo"
            class="w-32 rounded-md bg-discord py-1 text-2xl font-black text-white"
          >
            Todo
          </A>
        </div>

        <iframe
          src="https://discord.com/widget?id=693908458986143824&theme=dark"
          width="350"
          height="500"
          title="Discord Widget"
          frame-border="0"
          class="mt-4 shrink-0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        />

        <footer class="mt-auto">
          <span>{`© ${new Date().getFullYear()} By `}</span>
          <A href="https://github.com/0-don">Don</A>
          <span> & </span>
          <A href="https://github.com/kryptn36">kryptn36</A>
        </footer>
      </div>
    </Layout>
  );
}
