export function Footer() {
  return (
    <footer className="fixed right-0 bottom-0 left-0 z-10 flex items-center justify-center gap-5 py-4 text-center">
      <code className="text-sm text-gray-400">
        Coding Global 2025 &copy; Tokyo
      </code>
      <p className="text-sm text-gray-400">|</p>
      <a
        href="https://github.com/0-don/coding.global-web"
        className="text-sm text-gray-400"
        target="_blank"
        rel="noopener noreferrer"
      >
        Get the repository
      </a>
    </footer>
  );
}
