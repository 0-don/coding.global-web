import Background from "../../components/layout/background";
import { Footer } from "../../components/layout/footer";
import { Navbar } from "../../components/layout/navbar";
import { Team } from "../../components/pages/team";

export default function TeamPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <Team />
      <Footer />
    </div>
  );
}
