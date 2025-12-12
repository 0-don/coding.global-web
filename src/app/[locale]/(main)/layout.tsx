import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/nav/navbar";
import { cn } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <main className={cn("relative min-h-screen w-full")}>
      <Background />
      <Navbar />
      <div>{props.children}</div>
      <Footer />
    </main>
  );
}
