import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Home } from "@/components/pages/home";

export default function Main() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <Home />
      <Footer />
    </div>
  );
}
