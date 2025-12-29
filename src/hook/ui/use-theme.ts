import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

export function useTheme() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useNextTheme();

  const getThemeClass = (darkClass: string, lightClass: string) => {
    if (!mounted) return darkClass;
    return resolvedTheme === "dark" ? darkClass : lightClass;
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return { getThemeClass, mounted, resolvedTheme };
}
