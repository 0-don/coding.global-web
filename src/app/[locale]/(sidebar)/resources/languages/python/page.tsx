import { TOCLayout } from "@/components/layout/resources/toc";
import {
  Python,
  pythonTOC,
} from "@/components/pages/resources/languages/python";

export default function PythonPage() {
  return (
    <TOCLayout toc={pythonTOC}>
      <Python />
    </TOCLayout>
  );
}
