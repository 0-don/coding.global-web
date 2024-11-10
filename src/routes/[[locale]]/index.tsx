import { A } from "@solidjs/router";
import { FaBrandsDiscord } from "solid-icons/fa";
import { Layout } from "~/components/container/layout";
import { useLanguage } from "~/components/provider/language-provider";
import { MetaHead } from "~/components/provider/meta-head";

export default function HomePage() {
  const { t, locale } = useLanguage();

  return (
    <Layout>
      <MetaHead
        title={t("HOME.META.TITLE")!}
        description={t("HOME.META.DESCRIPTION")!}
        keywords={t("HOME.META.KEYWORDS")}
      />
      <div class="flex size-full flex-col items-center text-center">
        <A class="mt-auto" href="https://discord.gg/coding">
          <div class="mt-2 size-36">
            <img src="/images/logo_512.gif" class="rounded-full" />
          </div>
        </A>
        <h1 class="mt-4">{t("HOME.OFFICIAL_CODING_DISCORD_WEBSITE")}</h1>
        <p class="mt-2 text-sm">
          {t("HOME.OFFICIAL")}{" "}
          <A class="underline" href="https://discord.gg/coding">
            discord.gg/coding
          </A>{" "}
          {t("HOME.WEBSITE_FOR_THE_CODING_DISCORD_SERVER")}
        </p>
        <p class="mt-2 text-sm">
          <A href="https://github.com/0-don/coding.global-web">
            {t("HOME.SEE_REPOSITORY")}
          </A>
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-2 text-white">
          <A
            href="https://discord.gg/coding"
            target="_blank"
            class="w-36 rounded-md bg-discord px-2 py-1 text-2xl font-black"
          >
            <div class="flex items-center gap-1">
              <FaBrandsDiscord />
              <span>{t("MAIN.BUTTON.DISCORD")}</span>
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
              <span>{t("MAIN.BUTTON.DISBOARD")}</span>
            </div>
          </A>
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-2 text-2xl font-black text-white">
          <A href={`/${locale()}/team`} class="rounded-md bg-discord px-4 py-1">
            {t("MAIN.NAVIGATION.TEAM")}
          </A>
          <A
            href={`/${locale()}/rules`}
            class="rounded-md bg-discord px-4 py-1"
          >
            {t("MAIN.NAVIGATION.RULES")}
          </A>
          <A href={`/${locale()}/news`} class="rounded-md bg-discord px-4 py-1">
            {t("MAIN.NAVIGATION.NEWS")}
          </A>
        </div>
        <div class="mt-2 flex flex-wrap justify-center gap-2 text-2xl font-black text-white">
          <A href={`/${locale()}/chat`} class="rounded-md bg-discord px-4 py-1">
            {t("MAIN.NAVIGATION.CHAT")}
          </A>
          <A href={`/${locale()}/todo`} class="rounded-md bg-discord px-4 py-1">
            {t("MAIN.NAVIGATION.TODO")}
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
          <span>{`© ${new Date().getFullYear()} ${t("HOME.BY")} `}</span>
          <A href="https://github.com/0-don">Don</A>
        </footer>
      </div>
    </Layout>
  );
}
