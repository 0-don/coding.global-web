import Background from "../components/background";
import { Footer } from "../components/footer";
import { HomeView } from "../components/hero/home-view";
import { Navbar } from "../components/navbar";

export default function Main() {
  return (
    <div className="relative h-screen w-full ...">
      <Background />
      <Navbar />
      <HomeView />
      <Footer />
    </div>
  );
}
