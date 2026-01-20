import {
  BreadcrumbItem,
  buildBreadcrumbListSchema,
} from "@/lib/config/structured-data";

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbJsonLd(props: BreadcrumbJsonLdProps) {
  const data = buildBreadcrumbListSchema(props.items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
