import { LayoutWrapper } from "@/components/container/layout-wrapper";
import Background from "@/components/layout/background";
import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/nav/navbar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout(props: MainLayoutProps) {
  return (
    <LayoutWrapper container={false}>
      <Background />
      <Navbar />
      {props.children}
      <Footer />
    </LayoutWrapper>
  );
}
