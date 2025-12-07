import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { News } from "@/components/pages/news";
import { LayoutWrapper } from "@/components/container/layout-wrapper";

export default function NewsPage() {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      <News />
      <Footer />
    </LayoutWrapper>
  );
}
