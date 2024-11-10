import { Card } from "@/components/ui/card";
import { createMemo, For } from "solid-js";
import { Header } from "~/components/container/header";
import { Layout } from "~/components/container/layout";
import { MetaHead } from "~/components/elements/meta-head";
import { useLanguage } from "~/components/provider/language-provider";

export default function RulesPage() {
  const { t } = useLanguage();

  const rules = createMemo(() => [
    {
      title: t("RULES.DISCORD_GUIDELINES"),
      content: [t("RULES.DISCORD_GUIDELINES_CONTENT1")],
    },
    {
      title: t("RULES.LANGUAGE"),
      content: [t("RULES.LANGUAGE_CONTENT1")],
    },
    {
      title: t("RULES.ASKING_QUESTIONS"),
      content: [
        t("RULES.ASKING_QUESTIONS_CONTENT1"),
        t("RULES.ASKING_QUESTIONS_CONTENT2"),
        t("RULES.ASKING_QUESTIONS_CONTENT3"),
        t("RULES.ASKING_QUESTIONS_CONTENT4"),
        t("RULES.ASKING_QUESTIONS_CONTENT5"),
      ],
    },
    {
      title: t("RULES.RECORDING"),
      content: [t("RULES.RECORDING_CONTENT1")],
    },
    {
      title: t("RULES.ADVERTISING"),
      content: [t("RULES.ADVERTISING_CONTENT1")],
    },
    {
      title: t("RULES.MODERATORS"),
      content: [t("RULES.MODERATORS_CONTENT1")],
    },
    {
      title: t("RULES.DIRECT_MESSAGES"),
      content: [t("RULES.DIRECT_MESSAGES_CONTENT1")],
    },
    {
      title: t("RULES.PERSONAL_INFO"),
      content: [t("RULES.PERSONAL_INFO_CONTENT1")],
    },
    {
      title: t("RULES.ENFORCEMENT"),
      content: [t("RULES.ENFORCEMENT_CONTENT1")],
    },
  ]);

  return (
    <>
      <MetaHead
        title={t("RULES.META.TITLE")!}
        description={t("RULES.META.DESCRIPTION")!}
        keywords={t("RULES.META.KEYWORDS")}
      />

      <Layout container class="mt-10 h-[calc(100vh-5rem)]">
        <Card class="flex h-full flex-col bg-card/80 px-10 py-5">
          <Header name="RULES.TITLE" className="mb-5" />
          <div class="mt-5 flex-1 overflow-y-auto px-1">
            <div class="grid gap-4">
              <For each={rules()}>
                {(rule, index) => (
                  <Card class="p-6">
                    <h2 class="mb-4 text-xl font-semibold">
                      {`${index() + 1}. ${rule.title}`}
                    </h2>
                    <div class="space-y-2">
                      <For each={rule.content}>
                        {(content, contentIndex) => (
                          <p
                            innerHTML={`${index() + 1}.${contentIndex() + 1} ${content}`}
                          />
                        )}
                      </For>
                    </div>
                  </Card>
                )}
              </For>
            </div>
          </div>
        </Card>
      </Layout>
    </>
  );
}
