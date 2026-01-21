import { buildOrganizationSchema } from "@/lib/config/structured-data";

export function OrganizationJsonLd() {
  const data = buildOrganizationSchema();

  return (
    <script
      key="organization-jsonld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      suppressHydrationWarning
    />
  );
}
