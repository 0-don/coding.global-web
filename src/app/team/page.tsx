import Background from "../../components/background";
import { Footer } from "../../components/footer";
import { Navbar } from "../../components/navbar";
import { TeamView } from "../../components/hero/team-view";

export default function TeamPage() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <TeamView />
      <Footer />
    </div>
  );
}
