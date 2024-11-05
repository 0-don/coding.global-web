import type { EdenFetchError } from "@elysiajs/eden/dist/errors";
import type { ValueError } from "@sinclair/typebox/errors";
import type { NullableTranslator } from "@solid-primitives/i18n";
import { isServer } from "solid-js/web";
import { toast } from "solid-sonner";
import type { Dictionary, DictionaryKey } from "~/lib/i18n";

type ErrorInfo = {
  title: string;
  description?: string;
};

export function handleError(
  e: unknown,
  t?: NullableTranslator<Dictionary, string>,
) {
  if (isServer) return null;

  console.error(e);

  let errors: ErrorInfo[] = [];

  // Try to parse JSON error message
  try {
    errors = (JSON.parse((e as Error).message).errors as Error[]).map(
      (err) => ({
        title: err.name,
        description: err.message,
      }),
    );
  } catch (_) {
    // Handle standard Error objects
    if (e instanceof Error) {
      errors = [{ title: e.name, description: e.message }];
    }

    // Handle errors with status and value
    if (e instanceof Error && "status" in e && "value" in e) {
      errors = [
        {
          title: `${e.status}: ${e.value}`,
          description: e.message,
        },
      ];
    }

    // Handle Eden fetch errors
    const edenErrors =
      (e as EdenFetchError<number, { errors: ValueError[] }>)?.value?.errors ||
      [];

    if (edenErrors.length) {
      errors = edenErrors.map((err) => ({
        title: err.path.replaceAll("/", ""),
        description: err.message,
      }));
    }
  }

  // Display errors
  errors.forEach((error) => {
    const title = t ? t(error.title as DictionaryKey) : error.title;
    const description = t
      ? t(error.description as DictionaryKey)
      : error.description;

    setTimeout(() => {
      const t = title || error.title;
      const d = description || error.description;

      toast.warning(t, { description: d, duration: 5000 });
    }, 500);
  });

  // if (process.env.NODE_ENV === "production") console.clear();

  return null;
}
