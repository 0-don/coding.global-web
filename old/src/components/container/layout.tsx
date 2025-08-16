import { Component, JSX, Show } from "solid-js";
import { cn } from "~/lib/utils";
import { ConsoleToggle } from "../elements/toggle/console-toggle";
import LanguageToggle from "../elements/toggle/language-toggle";
import { LogoutToggle } from "../elements/toggle/logout.-toggle";
import { ThemeToggle } from "../elements/toggle/theme-toggle";

interface LayoutProps {
  class?: string;
  container?: boolean;
  children: JSX.Element;
}

export const Layout: Component<LayoutProps> = (props) => {
  return (
    <>
      <div class="absolute left-0 top-0 z-9999">
        <LanguageToggle />

        <Show when={import.meta.env.DEV}>
          <ConsoleToggle />
        </Show>
      </div>
      <div class="absolute right-0 top-0 z-9999">
        <LogoutToggle />

        <ThemeToggle />
      </div>
      <div class="fixed inset-0 -z-10">
        <img
          src="/images/dc Banner5.gif"
          class="img-fade h-screen w-screen object-cover object-top opacity-20"
        />
      </div>
      <div class="relative">
        <section
          class={cn(
            props.container && "container mx-auto",
            "min-h-96",
            props.class,
          )}
        >
          {props.children}
        </section>
      </div>
    </>
  );
};
