// src/app/[locale]/layout.tsx
import { routing } from "@/i18n/routing";
import { getPageMetadata } from "@/lib/config/metadata";
import { serverLocale } from "@/lib/utils/server";
import { hasLocale } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Fira_Code, Roboto_Serif, Source_Code_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { use } from "react";
import { Toaster } from "sonner";
import { Providers } from "../../components/provider/providers";
import "../globals.css";

const sourceCodePro = Source_Code_Pro({
  subsets: ["latin"],
  variable: "--font-sans",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  variable: "--font-serif",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

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

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} className="h-full" suppressHydrationWarning>
      <body
        className={`${sourceCodePro.variable} ${robotoSerif.variable} ${firaCode.variable} flex min-h-full flex-col antialiased`}
      >
        <Toaster />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
