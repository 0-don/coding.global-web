import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Rules } from "@/components/pages/rules";

export default function RulesPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <Rules />
      <Footer />
    </div>
  );
}
