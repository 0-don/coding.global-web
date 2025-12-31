"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { ResourceFooter } from "../../../layout/resources/resource-footer";

const toc: TOCItemType[] = [
  { url: "#introduction", title: "Introduction", depth: 2 },
  { url: "#learning-platforms", title: "Learning Platforms", depth: 2 },
  { url: "#web-security", title: "Web Security", depth: 2 },
  { url: "#network-security", title: "Network Security", depth: 2 },
  { url: "#secure-coding", title: "Secure Coding", depth: 2 },
  { url: "#tools", title: "Security Tools", depth: 2 },
];

const learningPlatforms = [
  {
    title: "TryHackMe",
    description:
      "Free online platform for learning cyber security with hands-on exercises and labs",
    url: "https://tryhackme.com/",
  },
  {
    title: "Hack The Box",
    description:
      "Cyber mastery platform with beginner-friendly modules and real-world challenges",
    url: "https://hackthebox.com/",
  },
  {
    title: "picoCTF",
    description:
      "Free computer security education program by Carnegie Mellon University",
    url: "https://www.picoctf.org/",
  },
  {
    title: "Root Me",
    description:
      "Platform for practicing hacking skills with challenges and virtual environments",
    url: "https://www.root-me.org/",
  },
  {
    title: "Cisco Networking Academy",
    description:
      "Learn cybersecurity, networking, and Python from Cisco's official training program",
    url: "https://netacad.com/",
  },
];

export const cyberSecurityTOC = createTOC(toc);

export function CyberSecurity() {
  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">Cyber Security</h1>

      <section id="introduction" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
        <p className="text-muted-foreground mb-4">
          Let&apos;s be honest - most of us got into cyber security because we
          wanted to be hackers. We imagined ourselves breaking into systems,
          bypassing firewalls, and doing cool stuff like in the movies. Then
          reality hit: turns out hacking is mostly just... coding. A lot of
          coding.
        </p>
        <p className="text-muted-foreground">
          But that&apos;s actually the good news. The skills you learn in cyber
          security - understanding systems, networks, and how software works -
          make you a better developer overall. Whether you end up in pentesting,
          security engineering, or just writing more secure code, it all starts
          with the fundamentals.
        </p>
      </section>

      <section id="learning-platforms" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Learning Platforms</h2>
        <p className="text-muted-foreground mb-6">
          The best way to learn cyber security is by doing. These platforms
          offer hands-on challenges, CTFs, and virtual labs where you can
          practice legally and safely.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {learningPlatforms.map((platform) => (
            <a
              key={platform.url}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="hover:bg-muted/50 h-full transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {platform.title}
                    <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </CardTitle>
                  <CardDescription>{platform.description}</CardDescription>
                </CardHeader>
              </Card>
            </a>
          ))}
        </div>
      </section>

      <ResourceFooter />
    </div>
  );
}
