import { TOCLayout } from "@/components/layout/resources/toc";
import { Resources, resourcesTOC } from "@/components/pages/resources/resources";

export default function ResourcesPage() {
  return (
    <TOCLayout toc={resourcesTOC}>
      <Resources />
    </TOCLayout>
  );
}
