import { TOCLayout } from "@/components/layout/resources/toc";
import {
  Javascript,
  javascriptTOC,
} from "@/components/pages/resources/languages/javascript";

export default function JavascriptPage() {
  return (
    <TOCLayout toc={javascriptTOC}>
      <Javascript />
    </TOCLayout>
  );
}
