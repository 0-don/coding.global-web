"use client";

import { useSetSidebarAnchors } from "@/components/layout/sidebar/sidebar-anchor-context";
import type { AnchorItem } from "@/components/layout/sidebar/sidebar-anchor-navigation";
import { HiOutlineCodeBracket, HiOutlineCommandLine, HiOutlineCloud, HiOutlinePuzzlePiece, HiOutlineWrenchScrewdriver } from "react-icons/hi2";

const anchors: AnchorItem[] = [
  { id: "editors", label: "Code Editors", icon: HiOutlineCodeBracket },
  { id: "terminal", label: "Terminal Tools", icon: HiOutlineCommandLine },
  { id: "cloud", label: "Cloud Services", icon: HiOutlineCloud },
  { id: "extensions", label: "Extensions", icon: HiOutlinePuzzlePiece },
  { id: "utilities", label: "Utilities", icon: HiOutlineWrenchScrewdriver },
];

export default function BestToolsPage() {
  useSetSidebarAnchors(anchors, "On This Page");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Best Tools</h1>

      <section id="editors" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Code Editors & IDEs</h2>
        <p className="text-muted-foreground">
          Explore the best code editors and integrated development environments.
          From lightweight editors like VS Code to full-featured IDEs like
          JetBrains products, find the right tool for your workflow.
        </p>
      </section>

      <section id="terminal" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Terminal Tools</h2>
        <p className="text-muted-foreground">
          Level up your command line experience with modern terminals, shell configurations,
          and CLI tools. Discover tools like Warp, Oh My Zsh, and essential command-line utilities.
        </p>
      </section>

      <section id="cloud" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Cloud Services</h2>
        <p className="text-muted-foreground">
          Essential cloud platforms for development, hosting, and deployment.
          Compare options like Vercel, AWS, Google Cloud, and specialized
          services for different use cases.
        </p>
      </section>

      <section id="extensions" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Extensions & Plugins</h2>
        <p className="text-muted-foreground">
          Must-have extensions for your editor and browser. Productivity boosters,
          code formatters, AI assistants, and tools that streamline your development process.
        </p>
      </section>

      <section id="utilities" className="mb-12 scroll-mt-20">
        <h2 className="text-2xl font-semibold mb-4">Development Utilities</h2>
        <p className="text-muted-foreground">
          Handy utilities for everyday development tasks. API testing tools,
          database managers, design tools, and other software that makes
          coding more efficient.
        </p>
      </section>
    </div>
  );
}
