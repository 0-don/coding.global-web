import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Home } from "@/components/pages/home";
import { LayoutWrapper } from "@/components/container/layout-wrapper";

export default function Main() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <Home />
      <Footer />
    </LayoutWrapper>
  );
}
