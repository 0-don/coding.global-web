"use client";

import { createTOC } from "@/components/layout/resources/toc";
import type { TOCItemType } from "fumadocs-core/toc";
import { useTranslations } from "next-intl";
import { ResourceFooter } from "../../../layout/resources/resource-footer";

const toc: TOCItemType[] = [];

export const pythonTOC = createTOC(toc);

export function Python() {
  const t = useTranslations();

  return (
    <div className="px-8 py-8">
      <h1 className="mb-8 text-3xl font-bold">{t("RESOURCES.PYTHON.TITLE")}</h1>

      <section className="mb-12">
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.PYTHON.CONTENT_1")}
        </p>
        <p className="text-muted-foreground mb-4">
          {t("RESOURCES.PYTHON.CONTENT_2")}
        </p>
        <p className="text-muted-foreground">
          {t("RESOURCES.PYTHON.CONTENT_3")}{" "}
          <a
            href="https://www.freecodecamp.org/learn/scientific-computing-with-python/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("RESOURCES.PYTHON.FREECODECAMP_LINK")}
          </a>{" "}
          {t("RESOURCES.PYTHON.OR")}{" "}
          <a
            href="https://www.codecademy.com/catalog/language/python"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {t("RESOURCES.PYTHON.CODECADEMY_LINK")}
          </a>
          .
        </p>
      </section>

      <ResourceFooter />
    </div>
  );
}
