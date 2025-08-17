import Background from "@/components/Background";
import Footer from "@/components/footer";
import Hero from "@/components/hero/Hero";
import Navbar from "@/components/NavBar";

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
