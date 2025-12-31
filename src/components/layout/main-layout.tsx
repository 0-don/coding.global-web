interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout(props: MainLayoutProps) {
  return (
    <main className="@container/main flex flex-1 flex-col gap-2">
      {props.children}
    </main>
  );
}
