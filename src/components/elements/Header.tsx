import { A } from "@solidjs/router";
import { Component } from "solid-js";
import { Button } from "~/components/ui/button";

interface HeaderProps {
  name: string;
}

export const Header: Component<HeaderProps> = ({ name }) => {
  return (
    <div class="flex items-center justify-between mt-6">
      <A href="/">
        <button class="rounded bg-blue-500 font-bold hover:bg-blue-700">
          <Button variant="outline">Home</Button>
        </button>
      </A>

      <h1 class="font-secondary text-center text-white">{name}</h1>
      <div></div>
    </div>
  );
};
