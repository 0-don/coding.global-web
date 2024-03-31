import { A } from "@solidjs/router";
import { HiSolidHomeModern } from "solid-icons/hi";
import { Component } from "solid-js";
import { Button } from "~/components/ui/button";

interface HeaderProps {
  name: string;
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <div class="grid grid-cols-3 content-center">
      <A href="/">
        <Button>
          <HiSolidHomeModern />
          <span>Home</span>
        </Button>
      </A>

      <h1 class="text-center text-3xl font-bold">{props.name}</h1>
    </div>
  );
};
