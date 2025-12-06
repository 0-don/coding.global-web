import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { News } from "@/components/pages/news";

export default function NewsPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <News />
      <Footer />
    </div>
  );
}
