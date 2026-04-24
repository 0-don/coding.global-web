import { ArticleData, buildArticleSchema } from "@/lib/config/structured-data";

export function ArticleJsonLd(props: { data: ArticleData }) {
  const schema = buildArticleSchema(props.data);
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
