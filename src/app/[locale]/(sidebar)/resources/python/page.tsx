"use client";

import { useSetSidebarAnchors } from "@/components/layout/sidebar/sidebar-anchor-context";
import type { AnchorItem } from "@/components/layout/sidebar/sidebar-anchor-navigation";
import {
  HiOutlineBookOpen,
  HiOutlineCodeBracket,
  HiOutlineCpuChip,
  HiOutlineLink,
  HiOutlineRocketLaunch,
} from "react-icons/hi2";

const anchors: AnchorItem[] = [
  { id: "overview", label: "Overview", icon: HiOutlineBookOpen },
  {
    id: "getting-started",
    label: "Getting Started",
    icon: HiOutlineRocketLaunch,
  },
  { id: "data-science", label: "Data Science", icon: HiOutlineCpuChip },
  { id: "examples", label: "Examples", icon: HiOutlineCodeBracket },
  { id: "resources", label: "Resources", icon: HiOutlineLink },
];

export default function PythonPage() {
  useSetSidebarAnchors(anchors, "On This Page");

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Python Resources</h1>

      <section id="overview" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Overview</h2>
        <p className="text-muted-foreground">
          Python is a powerful, beginner-friendly programming language known for
          its readability and versatility. It excels in data science, web
          development, automation, and AI/ML.
        </p>
      </section>

      <section id="getting-started" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Getting Started</h2>
        <p className="text-muted-foreground">
          Begin with Python basics: variables, data types, functions, and
          control structures. Learn about virtual environments, pip package
          management, and Python best practices.
        </p>
      </section>

      <section id="data-science" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Data Science</h2>
        <p className="text-muted-foreground">
          Explore Python&apos;s data science ecosystem including NumPy, Pandas,
          Matplotlib, and machine learning libraries like scikit-learn and
          TensorFlow.
        </p>
      </section>

      <section id="examples" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Examples</h2>
        <p className="text-muted-foreground">
          Practical code examples covering file handling, web scraping, API
          development with Flask/FastAPI, and data analysis projects.
        </p>
      </section>

      <section id="resources" className="mb-12 scroll-mt-20">
        <h2 className="mb-4 text-2xl font-semibold">Resources</h2>
        <p className="text-muted-foreground">
          Official documentation, community tutorials, and recommended courses
          for advancing your Python skills.
        </p>
      </section>
    </div>
  );
}
