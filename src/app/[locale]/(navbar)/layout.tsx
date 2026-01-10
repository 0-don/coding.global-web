import Background from "@/components/layout/nav/background";
import { Footer } from "@/components/layout/nav/footer";
import Navbar from "@/components/layout/nav/navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <>
      <Background />
      <Navbar />

      <main className="flex-1 pt-16">
        {props.children}
        {/* <iframe
          src="https://discord.com/widget?id=693908458986143824&theme=dark"
          width="350"
          height="500"
          frameBorder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        /> */}

      </main>
      <Footer />
    </>
  );
}
