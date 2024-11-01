import { Component, JSX, Show } from "solid-js";
import { ConsoleToggle } from "./navbar/console-toggle";
import LanguageToggle from "./navbar/language-toggle";
import { ThemeToggle } from "./navbar/theme-toggle";

interface LayoutProps {
  class?: string;
  container?: boolean;
  children: JSX.Element;
}

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <>
      <div class="absolute left-0 top-0 z-[9999]">
        <LanguageToggle />
      </div>
      <div class="absolute right-0 top-0 z-[9999]">
        <Show when={import.meta.env.DEV}>
          <ConsoleToggle />
        </Show>
        <ThemeToggle />
      </div>
      <div class="fixed inset-0 -z-10">
        <img
          src="/images/banner.webp"
          class="img-fade h-screen w-screen object-cover object-top opacity-20"
        />
      </div>
      <div class="relative">
        <section
          class={`${props.container ? "container mx-auto" : ""} ${props.class}`}
        >
          {props.children}
        </section>
      </div>
    </>
  );
};
