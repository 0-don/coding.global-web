import { buildWebsiteSchema } from "@/lib/config/structured-data";

export function WebsiteJsonLd(props: { locale: string }) {
  const data = buildWebsiteSchema(props.locale);
  return (
    <script
      key="website-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}
