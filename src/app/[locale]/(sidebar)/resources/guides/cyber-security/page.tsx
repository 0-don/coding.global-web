"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import type { TOCItemType } from "fumadocs-core/toc";

const toc: TOCItemType[] = [
  { url: "#introduction", title: "Introduction", depth: 2 },
  { url: "#web-security", title: "Web Security", depth: 2 },
  { url: "#network-security", title: "Network Security", depth: 2 },
  { url: "#secure-coding", title: "Secure Coding", depth: 2 },
  { url: "#tools", title: "Security Tools", depth: 2 },
];

export default function CyberSecurityPage() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Cyber Security</h1>

      <section id="introduction" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Introduction</h2>
        <p className="text-muted-foreground">
          Cyber security is the practice of protecting systems, networks, and
          programs from digital attacks. Learn the fundamentals of keeping your
          applications and data safe from threats.
        </p>
      </section>

      <section id="web-security" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Web Security</h2>
        <p className="text-muted-foreground">
          Understand common web vulnerabilities like XSS, CSRF, SQL injection,
          and how to prevent them. Explore the OWASP Top 10 and web application
          security best practices.
        </p>
      </section>

      <section id="network-security" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Network Security</h2>
        <p className="text-muted-foreground">
          Learn about firewalls, VPNs, intrusion detection systems, and network
          segmentation. Understand how to secure network infrastructure and
          protect against attacks.
        </p>
      </section>

      <section id="secure-coding" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Secure Coding</h2>
        <p className="text-muted-foreground">
          Write code that is resistant to attacks. Learn about input validation,
          authentication best practices, encryption, and secure development
          lifecycle (SDL).
        </p>
      </section>

      <section id="tools" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Security Tools</h2>
        <p className="text-muted-foreground">
          Discover tools for vulnerability scanning, penetration testing, and
          security monitoring. From Burp Suite to SAST/DAST tools, learn what
          professionals use.
        </p>
      </section>
    </div>
  );
}
