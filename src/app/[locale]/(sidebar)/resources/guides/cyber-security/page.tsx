import { TOCLayout } from "@/components/layout/resources/toc";
import {
  CyberSecurity,
  cyberSecurityTOC,
} from "@/components/pages/resources/guides/cyber-security";

export default function CyberSecurityPage() {
  return (
    <TOCLayout toc={cyberSecurityTOC}>
      <CyberSecurity />
    </TOCLayout>
  );
}
