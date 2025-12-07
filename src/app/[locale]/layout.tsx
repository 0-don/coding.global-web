import { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { use } from "react";
import { Toaster } from "sonner";
import { Providers } from "../../components/provider/providers";
import "../globals.css";

export const metadata: Metadata = {
  title: "Coding Global [EN/GER]",
  description: "Official Coding Global Website for Programmers Worldwide",
  keywords: [
    "Coding Global",
    "Discord Community",
    "Programming",
    "Developers",
    "EN",
    "GER",
  ],
  authors: [{ name: "Coding Global", url: "https://coding.global" }],
  creator: "Coding Global",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Coding Global [EN/GER]",
    description: "Official Coding Global Website for Programmers Worldwide",
    url: "https://coding.global",
    siteName: "Coding Global",
    type: "website",
    images: [
      {
        url: "https://coding.global/banner.png",
        width: 1200,
        height: 630,
        alt: "Coding Global Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Global [EN/GER]",
    description: "Official Coding Global Website for Programmers Worldwide",
    site: "@codingglobal",
    creator: "@codingglobal",
    images: ["https://coding.global/banner.png"],
  },
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default function RootLayout(props: Props) {
  const { locale } = use(props.params);

  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`flex min-h-full flex-col antialiased`}>
        <Toaster />
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
