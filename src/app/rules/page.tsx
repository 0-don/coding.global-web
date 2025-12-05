import Background from "../../components/background";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { RulesView } from "../../components/hero/rules-view";

export default function RulesPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <RulesView />
      <Footer />
    </div>
  );
}
