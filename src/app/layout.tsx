import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SectionProvider } from "../context/SectionContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Coding Global [EN/GER]",
  description: "Official Coding Global  Website",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Coding Global [EN/GER]",
    description: "Official Coding Global  Website",
    images: "/banner.gif",
    url: "https://coding.global",
    siteName: "Coding Global",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Coding Global [EN/GER]",
    description: "Official Coding  Global Website",
    images: "/banner.gif",
    site: "@codingglobal",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SectionProvider>{children}</SectionProvider>
      </body>
    </html>
  );
}
