"use client";

import { createTOC } from "@/components/layout/resources/toc";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { msg } from "@/lib/config/constants";
import type { TOCItemType } from "fumadocs-core/toc";
import { ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { ResourceFooter } from "../../layout/resources/resource-footer";

const sections = [
  {
    id: "programming-books",
    titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.TITLE"),
    descriptionKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.DESCRIPTION"),
    items: [
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.FREE_PROGRAMMING_BOOKS.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.FREE_PROGRAMMING_BOOKS.DESCRIPTION",
        ),
        url: "https://ebookfoundation.github.io/free-programming-books-search/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.GOALKICKER.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.GOALKICKER.DESCRIPTION",
        ),
        url: "https://goalkicker.com/",
      },
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.GREEN_TEA_PRESS.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.GREEN_TEA_PRESS.DESCRIPTION",
        ),
        url: "https://greenteapress.com/wp/",
      },
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.ELOQUENT_JAVASCRIPT.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.ELOQUENT_JAVASCRIPT.DESCRIPTION",
        ),
        url: "https://eloquentjavascript.net/",
      },
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.AUTOMATE_THE_BORING_STUFF.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.AUTOMATE_THE_BORING_STUFF.DESCRIPTION",
        ),
        url: "https://automatetheboringstuff.com/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.RUST_BOOK.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.RUST_BOOK.DESCRIPTION",
        ),
        url: "https://doc.rust-lang.org/book/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.PRO_GIT.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.PRO_GIT.DESCRIPTION",
        ),
        url: "https://git-scm.com/book/en/v2",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.CODERS_GUILD.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.CODERS_GUILD.DESCRIPTION",
        ),
        url: "https://codersguild.net/books",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.PROGRAMMING_BOOKS.IT_EBOOKS.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.PROGRAMMING_BOOKS.IT_EBOOKS.DESCRIPTION",
        ),
        url: "https://it-ebooks.dev/",
      },
    ],
  },
  {
    id: "free-books",
    titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.TITLE"),
    descriptionKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.DESCRIPTION"),
    items: [
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.OPEN_LIBRARY.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.OPEN_LIBRARY.DESCRIPTION",
        ),
        url: "https://openlibrary.org/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.INTERNET_ARCHIVE.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.INTERNET_ARCHIVE.DESCRIPTION",
        ),
        url: "https://archive.org/details/texts",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.PROJECT_GUTENBERG.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.PROJECT_GUTENBERG.DESCRIPTION",
        ),
        url: "https://www.gutenberg.org/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.STANDARD_EBOOKS.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.STANDARD_EBOOKS.DESCRIPTION",
        ),
        url: "https://standardebooks.org/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.OPENSTAX.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.OPENSTAX.DESCRIPTION",
        ),
        url: "https://openstax.org/",
      },
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.OPEN_TEXTBOOK_LIBRARY.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.OPEN_TEXTBOOK_LIBRARY.DESCRIPTION",
        ),
        url: "https://open.umn.edu/opentextbooks",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.LIBBY.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.LIBBY.DESCRIPTION"),
        url: "https://libbyapp.com/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.FREE_BOOKS.LIBRIVOX.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.FREE_BOOKS.LIBRIVOX.DESCRIPTION",
        ),
        url: "https://librivox.org/",
      },
    ],
  },
  {
    id: "research-papers",
    titleKey: msg("RESOURCES.LIBRARY.RESEARCH_PAPERS.TITLE"),
    descriptionKey: msg("RESOURCES.LIBRARY.RESEARCH_PAPERS.DESCRIPTION"),
    items: [
      {
        titleKey: msg("RESOURCES.LIBRARY.RESEARCH_PAPERS.ARXIV.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.RESEARCH_PAPERS.ARXIV.DESCRIPTION",
        ),
        url: "https://arxiv.org/",
      },
      {
        titleKey: msg(
          "RESOURCES.LIBRARY.RESEARCH_PAPERS.SEMANTIC_SCHOLAR.TITLE",
        ),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.RESEARCH_PAPERS.SEMANTIC_SCHOLAR.DESCRIPTION",
        ),
        url: "https://www.semanticscholar.org/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.RESEARCH_PAPERS.CORE.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.RESEARCH_PAPERS.CORE.DESCRIPTION",
        ),
        url: "https://core.ac.uk/",
      },
    ],
  },
  {
    id: "documentation",
    titleKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.TITLE"),
    descriptionKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.DESCRIPTION"),
    items: [
      {
        titleKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.DEVDOCS.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.DOCUMENTATION.DEVDOCS.DESCRIPTION",
        ),
        url: "https://devdocs.io/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.MDN.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.MDN.DESCRIPTION"),
        url: "https://developer.mozilla.org/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.TLDR.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.TLDR.DESCRIPTION"),
        url: "https://tldr.sh/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.DOCUMENTATION.CHEAT_SH.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.DOCUMENTATION.CHEAT_SH.DESCRIPTION",
        ),
        url: "https://cheat.sh/",
      },
    ],
  },
  {
    id: "courses",
    titleKey: msg("RESOURCES.LIBRARY.COURSES.TITLE"),
    descriptionKey: msg("RESOURCES.LIBRARY.COURSES.DESCRIPTION"),
    items: [
      {
        titleKey: msg("RESOURCES.LIBRARY.COURSES.CS50.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.COURSES.CS50.DESCRIPTION"),
        url: "https://cs50.harvard.edu/x/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.COURSES.MIT_OCW.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.COURSES.MIT_OCW.DESCRIPTION"),
        url: "https://ocw.mit.edu/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.COURSES.TEACH_YOURSELF_CS.TITLE"),
        descriptionKey: msg(
          "RESOURCES.LIBRARY.COURSES.TEACH_YOURSELF_CS.DESCRIPTION",
        ),
        url: "https://teachyourselfcs.com/",
      },
      {
        titleKey: msg("RESOURCES.LIBRARY.COURSES.OSSU.TITLE"),
        descriptionKey: msg("RESOURCES.LIBRARY.COURSES.OSSU.DESCRIPTION"),
        url: "https://cs.ossu.dev/",
      },
    ],
  },
];

export const libraryTOC = createTOC(
  sections.map(
    (section): TOCItemType => ({
      url: `#${section.id}`,
      title: section.titleKey,
      depth: 2,
    }),
  ),
);

export function Library() {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-4 text-3xl font-bold">
        {t("RESOURCES.LIBRARY.TITLE")}
      </h1>
      <p className="text-muted-foreground mb-8">
        {t("RESOURCES.LIBRARY.DESCRIPTION")}
      </p>

      {sections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className="mb-12 scroll-mt-20"
        >
          <h2 className="mb-4 text-2xl font-semibold">{t(section.titleKey)}</h2>
          <p className="text-muted-foreground mb-6">
            {t(section.descriptionKey)}
          </p>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {section.items.map((item) => (
              <a
                key={item.url}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <Card className="hover:bg-muted/50 h-full transition-colors">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {t(item.titleKey)}
                      <ExternalLink className="ml-auto h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </CardTitle>
                    <CardDescription>{t(item.descriptionKey)}</CardDescription>
                  </CardHeader>
                </Card>
              </a>
            ))}
          </div>
        </section>
      ))}

      <ResourceFooter />
    </div>
  );
}
