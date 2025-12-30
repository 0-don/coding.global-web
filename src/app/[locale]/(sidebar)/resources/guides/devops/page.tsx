"use client";

import { useSetTOC } from "@/components/layout/toc/toc-context";
import type { TOCItemType } from "fumadocs-core/toc";

const toc: TOCItemType[] = [
  { url: "#what-is-devops", title: "What is DevOps", depth: 2 },
  { url: "#ci-cd", title: "CI/CD Pipelines", depth: 2 },
  { url: "#containerization", title: "Containerization", depth: 2 },
  { url: "#infrastructure", title: "Infrastructure as Code", depth: 2 },
  { url: "#monitoring", title: "Monitoring & Logging", depth: 2 },
];

export default function DevOpsPage() {
  useSetTOC(toc, "On This Page");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">DevOps</h1>

      <section id="what-is-devops" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">What is DevOps?</h2>
        <p className="text-muted-foreground">
          DevOps is a set of practices that combines software development (Dev)
          and IT operations (Ops). It aims to shorten the development lifecycle
          and provide continuous delivery with high software quality.
        </p>
      </section>

      <section id="ci-cd" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">CI/CD Pipelines</h2>
        <p className="text-muted-foreground">
          Continuous Integration and Continuous Deployment (CI/CD) automate the
          building, testing, and deployment of applications. Learn about tools
          like GitHub Actions, GitLab CI, Jenkins, and more.
        </p>
      </section>

      <section id="containerization" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Containerization</h2>
        <p className="text-muted-foreground">
          Containers package applications with their dependencies for consistent
          deployment. Explore Docker, Kubernetes, and container orchestration
          best practices.
        </p>
      </section>

      <section id="infrastructure" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Infrastructure as Code</h2>
        <p className="text-muted-foreground">
          Manage and provision infrastructure through code rather than manual
          processes. Learn about Terraform, Ansible, Pulumi, and cloud-native
          IaC solutions.
        </p>
      </section>

      <section id="monitoring" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Monitoring & Logging</h2>
        <p className="text-muted-foreground">
          Effective monitoring and logging are essential for maintaining
          reliable systems. Discover tools like Prometheus, Grafana, ELK Stack,
          and observability best practices.
        </p>
      </section>
    </div>
  );
}
