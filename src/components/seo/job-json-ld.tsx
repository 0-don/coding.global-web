import {
  buildJobPostingSchema,
  JobPostingData,
} from "@/lib/config/structured-data";

interface JobJsonLdProps {
  data: JobPostingData;
}

export function JobJsonLd(props: JobJsonLdProps) {
  const schema = buildJobPostingSchema(props.data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
