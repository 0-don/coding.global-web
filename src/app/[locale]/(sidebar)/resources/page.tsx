import { Link } from "@/i18n/navigation";
import { HiOutlineBolt, HiOutlineWrenchScrewdriver } from "react-icons/hi2";
import { SiJavascript, SiPython } from "react-icons/si";

const resourceCategories = [
  {
    title: "Programming Languages",
    description: "Learn popular programming languages with curated resources",
    items: [
      {
        name: "JavaScript",
        description: "Web development essentials",
        href: "/resources/javascript" as const,
        icon: SiJavascript,
      },
      {
        name: "Python",
        description: "Data science & automation",
        href: "/resources/python" as const,
        icon: SiPython,
      },
    ],
  },
  {
    title: "General Resources",
    description: "Productivity tips and recommended tools",
    items: [
      {
        name: "Vibe Coding",
        description: "Flow state & productivity",
        href: "/resources/vibe-coding" as const,
        icon: HiOutlineBolt,
      },
      {
        name: "Best Tools",
        description: "Recommended software",
        href: "/resources/best-tools" as const,
        icon: HiOutlineWrenchScrewdriver,
      },
    ],
  },
];

export default function ResourcesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Resources</h1>
        <p className="text-muted-foreground">
          Curated learning resources, tools, and guides for developers
        </p>
      </div>

      <div className="grid gap-8">
        {resourceCategories.map((category) => (
          <div key={category.title}>
            <h2 className="mb-2 text-xl font-semibold">{category.title}</h2>
            <p className="text-muted-foreground mb-4 text-sm">
              {category.description}
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {category.items.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="group hover:border-primary rounded-lg border p-4 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="bg-primary/10 rounded-md p-2">
                      <item.icon className="text-primary size-5" />
                    </div>
                    <div>
                      <h3 className="group-hover:text-primary font-medium transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
