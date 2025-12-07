import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Team } from "@/components/pages/team";
import { LayoutWrapper } from "@/components/container/layout-wrapper";

export default function TeamPage() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <Team />
      <Footer />
    </LayoutWrapper>
  );
}
