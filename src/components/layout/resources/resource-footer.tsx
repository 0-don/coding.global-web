import { Separator } from "@/components/ui/separator";

export function ResourceFooter() {
  return (
    <footer className="mt-16">
      <Separator className="mb-6" />
      <p className="text-muted-foreground text-sm">
        Want to add a new resource or edit an existing one? Visit our{" "}
        <a
          href="https://github.com/0-don/coding.global-web"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          GitHub
        </a>{" "}
        or join our{" "}
        <a
          href="https://discord.gg/coding"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Discord server
        </a>
        .
      </p>
    </footer>
  );
}
