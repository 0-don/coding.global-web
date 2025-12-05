import Background from "../../components/background";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { NewsView } from "../../components/hero/news-view";

export default function NewsPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <NewsView />
      <Footer />
    </div>
  );
}
