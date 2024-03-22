// import { clientOnly } from "@solidjs/start";
import { Component, JSX } from "solid-js";
import { ThemeToggle } from "../navbar/theme-toggle";
import LanguageToggle from "../navbar/language-toggle";

interface LayoutProps {
  children: JSX.Element;
}

// const LanguageToggle = clientOnly(() => import("../navbar/language-toggle"));

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <>
      <div class="absolute right-0 top-0 z-[9999]">
        <ThemeToggle />
      </div>
      <div class="absolute left-0 top-0 z-[9999]">
        <LanguageToggle />
      </div>
      <img
        src="/images/banner.webp"
        class="img-fade relative h-[50vh] w-full object-cover object-top opacity-20 md:h-screen"
      />
      <div class="absolute inset-0">{props.children}</div>
    </>
  );
};
