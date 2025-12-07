import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Rules } from "@/components/pages/rules";
import { LayoutWrapper } from "@/components/container/layout-wrapper";

export default function RulesPage() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <Rules />
      <Footer />
    </LayoutWrapper>
  );
}
