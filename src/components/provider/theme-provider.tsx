import {
  COLOR_MODE_STORAGE_KEY,
  ColorModeProvider,
  ColorModeScript,
  cookieStorageManagerSSR,
} from "@kobalte/core";
import { Component, JSX } from "solid-js";
import { isServer } from "solid-js/web";
import { getCookie } from "vinxi/http";

interface ThemeProviderProps {
  children: JSX.Element;
}

function getServerColorCookie() {
  "use server";
  const colorMode = getCookie(COLOR_MODE_STORAGE_KEY);
  if (!colorMode) return "";

  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  return [
    `${COLOR_MODE_STORAGE_KEY}=${colorMode}`,
    "path=/",
    `expires=${expires.toUTCString()}`,
    !import.meta.env.DEV && "secure",
  ]
    .filter(Boolean)
    .join("; ");
}

export const ThemeProvider: Component<ThemeProviderProps> = (props) => {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerColorCookie() : document.cookie,
  );

  return (
    <ColorModeProvider storageManager={storageManager}>
      <ColorModeScript storageType={storageManager.type} />
      {props.children}
    </ColorModeProvider>
  );
};
