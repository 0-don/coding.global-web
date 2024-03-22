import clientOnly from "@solidjs/start/dist/shared/clientOnly";
import { Component, JSX } from "solid-js";
import { LanguageToggle } from "../navbar/language-toggle";
import { ModeToggle } from "../navbar/mode-toggle";

interface LayoutProps {
  children: JSX.Element;
}
const LanguageProvider = clientOnly(
  () => import("../provider/language-provider"),
);

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <LanguageProvider>
      <div class="absolute right-0 top-0 z-[9999]">
        <ModeToggle />
      </div>
      <div class="absolute left-0 top-0 z-[9999]">
        <LanguageToggle />
      </div>
      <img
        src="/images/banner.webp"
        class="img-fade relative h-[50vh] w-full object-cover object-top opacity-20 md:h-screen"
      />
      <div class="absolute inset-0">{props.children}</div>
    </LanguageProvider>
  );
};
