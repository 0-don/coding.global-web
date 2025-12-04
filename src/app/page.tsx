import Background from "../components/background";
import Footer from "../components/footer";
import Hero from "../components/hero/hero";
import Navbar from "../components/navbar";

export default function Main() {
  return (
    <div className="relative w-full h-screen ...">
      <Background />
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
