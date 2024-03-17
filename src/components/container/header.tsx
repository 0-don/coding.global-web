import { A } from "@solidjs/router";
import { Component } from "solid-js";
import { Button } from "~/components/ui/button";

interface HeaderProps {
  name: string;
}

export const Header: Component<HeaderProps> = (props) => {
  return (
    <div class="mt-6 grid grid-cols-3  content-center">
      <A href="/">
        <button class="rounded bg-blue-500 font-bold hover:bg-blue-700">
          <Button variant="outline">Home</Button>
        </button>
      </A>

      <h1 class="font-secondary text-center text-2xl font-bold text-white">
        {props.name}
      </h1>
    </div>
  );
};
