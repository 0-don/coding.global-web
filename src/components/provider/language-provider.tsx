import { createEffect, createSignal, JSX, Show } from "solid-js";
import { localStorageDetector } from "typesafe-i18n/detectors";
import TypesafeI18n from "~/i18n/i18n-solid";
import { detectLocale } from "~/i18n/i18n-util";
import { loadLocaleAsync } from "~/i18n/i18n-util.async";

export default function LanguageProvider(props: { children: JSX.Element }) {
  const detectedLocale = detectLocale(localStorageDetector);

  const [wasLoaded, setWasLoaded] = createSignal(false);

  createEffect(() => {
    loadLocaleAsync(detectedLocale).then(() => setWasLoaded(true));
  });

  return (
    <Show when={wasLoaded()}>
      <TypesafeI18n locale={detectedLocale}>{props.children}</TypesafeI18n>
    </Show>
  );
}
