import { Component } from 'solid-js';
import { A } from 'solid-start';

interface HeaderProps {
  name: string;
}

export const Header: Component<HeaderProps> = ({ name }) => {
  return (
    <div class='flex items-center justify-between'>
      <A href='/'>
        <button class='rounded bg-blue-500 font-bold hover:bg-blue-700'>
          Home
        </button>
      </A>

      <h1 class='font-secondary text-center text-white'>{name}</h1>
      <div></div>
    </div>
  );
};
