import { JSX } from 'solid-js';

export const Layout = ({ children }: { children: JSX.Element }) => {
  return (
    <>
      <img
        src='/images/banner.webp'
        class='img-fade relative h-[50vh] w-full object-cover object-top opacity-20 md:h-[100vh]'
      />
      <div class='absolute bottom-0 left-0 right-0 top-0'>{children}</div>
    </>
  );
};
