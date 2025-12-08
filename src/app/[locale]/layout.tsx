import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { authClient } from "@/lib/auth-client";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { use } from "react";
import { Toaster } from "sonner";
import { Providers } from "../../components/provider/providers";
import "../globals.css";

export async function generateMetadata(props: {
  params: Promise<{ locale: string }>;
}) {
  const locale = await serverLocale(props);
  const t = await getTranslations({ locale });

  return getPageMetadata({
    locale,
    title: t("METADATA.ROOT.TITLE"),
    description: t("METADATA.ROOT.DESCRIPTION"),
    keywords: t("METADATA.ROOT.KEYWORDS"),
  });
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function RootLayout(props: Props) {
  const { locale } = use(props.params);
  const header = use(headers());

  if (!hasLocale(routing.locales, locale)) notFound();

  const session = use(auth.api.getSession({ headers: header }));

  console.log("Session in layout:", session);

  // Set the session atom directly on the server!
  if (session) {
    authClient.$store.atoms.$sessionSignal?.set({
      data: session,
      isPending: false,
      error: null,
      isRefetching: false,
    });
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`flex min-h-full flex-col antialiased`}>
        <Toaster />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
