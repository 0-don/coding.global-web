import { createEffect, createSignal, JSX, Show } from "solid-js";
import { localStorageDetector } from "typesafe-i18n/detectors";
import TypesafeI18n from "~/i18n/i18n-solid";
import { detectLocale, loadedLocales } from "~/i18n/i18n-util";
import { loadLocale } from "~/i18n/i18n-util.sync";

export default function LanguageProvider(props: { children: JSX.Element }) {
  const detectedLocale = detectLocale(localStorageDetector);
  const [wasLoaded, setWasLoaded] = createSignal(false);

  createEffect(() => {
    loadLocale(detectedLocale);
    // loadLocale("de");
    // loadLocale("en");
    setWasLoaded(true);
    console.log(loadedLocales);
  });

  return (
    <Show when={wasLoaded()}>
      <TypesafeI18n locale={detectedLocale}>{props.children}</TypesafeI18n>
    </Show>
  );
}
