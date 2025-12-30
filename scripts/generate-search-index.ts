import { create, insert } from "@orama/orama";
import { persist } from "@orama/plugin-data-persistence";
import { error, log } from "console";
import { writeFileSync } from "fs";
import { join } from "path";

type SearchDocument = {
  title: string;
  description: string;
  url: string;
  category: string;
};

const searchablePages: SearchDocument[] = [
  // Community
  {
    title: "News",
    description: "Latest news and updates from the community",
    url: "/news",
    category: "Community",
  },
  {
    title: "Rules",
    description: "Community guidelines and rules",
    url: "/rules",
    category: "Community",
  },
  {
    title: "Showcase",
    description: "Community project showcase",
    url: "/showcase",
    category: "Community",
  },
  {
    title: "Team",
    description: "Meet the team behind Coding Global",
    url: "/team",
    category: "Community",
  },
  // Resources
  {
    title: "Resources",
    description: "Programming resources and tutorials",
    url: "/resources",
    category: "Resources",
  },
  {
    title: "JavaScript",
    description:
      "JavaScript programming resources, tutorials, and examples for web development",
    url: "/resources/javascript",
    category: "Resources",
  },
  {
    title: "Python",
    description:
      "Python programming resources for data science, web development, and automation",
    url: "/resources/python",
    category: "Resources",
  },
  {
    title: "Vibe Coding",
    description:
      "Tips for creating the perfect coding atmosphere and achieving flow state",
    url: "/resources/vibe-coding",
    category: "Resources",
  },
  {
    title: "Best Tools",
    description:
      "Curated list of the best development tools, editors, and utilities",
    url: "/resources/best-tools",
    category: "Resources",
  },
  // Marketplace
  {
    title: "Marketplace",
    description: "Job board and developer marketplace",
    url: "/marketplace",
    category: "Marketplace",
  },
  {
    title: "Job Board",
    description: "Find programming jobs and opportunities",
    url: "/marketplace/job-board",
    category: "Marketplace",
  },
  {
    title: "Dev Board",
    description: "Find developers for your projects",
    url: "/marketplace/dev-board",
    category: "Marketplace",
  },
];

async function generateSearchIndex() {
  log("Generating search index...");

  const db = create({
    schema: {
      title: "string",
      description: "string",
      url: "string",
      category: "string",
    } as const,
  });

  for (const doc of searchablePages) {
    await insert(db, doc);
  }

  const serialized = await persist(db, "json");
  const outputPath = join(process.cwd(), "public", "search-index.json");

  writeFileSync(outputPath, JSON.stringify(serialized));

  log(`Search index generated at ${outputPath}`);
  log(`Indexed ${searchablePages.length} pages`);
}

generateSearchIndex().catch(error);
