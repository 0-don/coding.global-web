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

function getServerCookies() {
  "use server";
  const colorMode = getCookie(COLOR_MODE_STORAGE_KEY);
  return colorMode ? `${COLOR_MODE_STORAGE_KEY}=${colorMode}` : "";
}

export const ThemeProvider: Component<ThemeProviderProps> = (props) => {
  const storageManager = cookieStorageManagerSSR(
    isServer ? getServerCookies() : document.cookie,
  );

  return (
    <ColorModeProvider storageManager={storageManager}>
      <ColorModeScript storageType={storageManager.type} />
      {props.children}
    </ColorModeProvider>
  );
};
