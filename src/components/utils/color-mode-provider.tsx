import {
  ColorMode,
  ColorModeContext,
  ColorModeContextType,
  ColorModeProviderProps,
  ColorModeStorageManager,
  ConfigColorMode,
  localStorageManager,
} from "@kobalte/core";
import { createSignal, onCleanup } from "solid-js";
import { isServer } from "solid-js/web";

export const FALLBACK_COLOR_MODE_VALUE: ConfigColorMode = "system";

function query() {
  return window.matchMedia("(prefers-color-scheme: dark)");
}
export function getSystemColorMode(fallback?: ColorMode): ColorMode {
  const isDark = query().matches ?? fallback === "dark";
  return isDark ? "dark" : "light";
}

export function getInitialColorMode(
  manager: ColorModeStorageManager,
): ColorMode {
  const fallback: ColorMode = "light";

  const initialColorMode = manager.get(fallback) ?? fallback;

  if (initialColorMode === "system") {
    // We can't know the client system preference in SSR so just return the fallback.
    return isServer ? fallback : getSystemColorMode();
  }

  return initialColorMode;
}

export function setColorModeDataset(
  value: ColorMode,
  shouldPreventTransition = true,
) {
  const cleanup = shouldPreventTransition ? preventTransition() : undefined;
  document.documentElement.dataset.kbTheme = value;
  document.documentElement.style.colorScheme = value;
  cleanup?.();
}

function preventTransition() {
  const css = document.createElement("style");
  css.appendChild(
    document.createTextNode(
      "*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  );
  document.head.appendChild(css);

  return () => {
    // force a reflow
    (() => window.getComputedStyle(document.body))();

    // wait for next tick
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        document.head.removeChild(css);
      });
    });
  };
}
export function addColorModeListener(fn: (cm: ColorMode) => unknown) {
  const mql = query();

  const listener = (e: MediaQueryListEvent) => {
    fn(e.matches ? "dark" : "light");
  };

  mql.addEventListener("change", listener);

  return () => {
    mql.removeEventListener("change", listener);
  };
}

export function ColorModeProvider(props: ColorModeProviderProps) {
  const fallbackColorMode = () =>
    props.initialColorMode ?? FALLBACK_COLOR_MODE_VALUE;
  const colorModeManager = () => props.storageManager ?? localStorageManager;
  let colorModeListenerCleanupFn: (() => unknown) | undefined;

  const [colorMode, rawSetColorMode] = createSignal(
    getInitialColorMode(colorModeManager()),
  );

  const applyColorMode = (value: ColorMode) => {
    rawSetColorMode(value);

    setColorModeDataset(value, props.disableTransitionOnChange);
  };

  const setColorMode = (value: ConfigColorMode) => {
    if (colorModeListenerCleanupFn) {
      colorModeListenerCleanupFn();
      colorModeListenerCleanupFn = undefined;
    }

    const isSystem = value === "system";

    if (isSystem) {
      colorModeListenerCleanupFn = addColorModeListener(applyColorMode);
    }

    applyColorMode(isSystem ? getSystemColorMode() : value);
    colorModeManager().set(value);
  };

  const toggleColorMode = () => {
    setColorMode(colorMode() === "dark" ? "light" : "dark");
  };

  // createEffect(() => {
  //   setColorMode(colorModeManager().get() ?? fallbackColorMode());
  // });

  onCleanup(() => {
    // ensure listener is always cleaned when component is destroyed.
    colorModeListenerCleanupFn?.();
  });

  const context: ColorModeContextType = {
    colorMode,
    setColorMode,
    toggleColorMode,
  };

  return (
    <ColorModeContext.Provider value={context}>
      {props.children}
    </ColorModeContext.Provider>
  );
}
