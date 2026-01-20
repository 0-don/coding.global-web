import { buildOrganizationSchema } from "@/lib/structured-data";

export function OrganizationJsonLd() {
  const data = buildOrganizationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
