import Background from "./components/Background";
import Hero from "./components/hero/Hero";
import Footer from "./components/footer";
import Navbar from "./components/NavBar";

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

 
 