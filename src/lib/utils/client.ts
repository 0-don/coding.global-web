import type { TranslationKey } from "@/lib/config/constants";
import type { ValueError } from "@sinclair/typebox/errors";
import {
  DefaultErrorFunction,
  SetErrorFunction,
} from "@sinclair/typebox/errors";
import type { useTranslations } from "next-intl";
import { toast } from "sonner";

SetErrorFunction((error) => {
  if (typeof error.schema.error === "string") return error.schema.error;
  return DefaultErrorFunction(error);
});

export class ResponseStatusError {
  timestamp!: Date;
  status!: number;
  error!: string;
  message!: string;
  path!: string;
  params?: Record<string, string>;
}

export type HandleError = {
  title: TranslationKey | (string & {});
  description?: TranslationKey | (string & {});
  params?: Record<string, string>;
};

export function handleError(
  e: unknown,
  t?: ReturnType<typeof useTranslations<never>>,
) {
  const error = e as ResponseStatusError;
  let errors: HandleError[] = [];

  try {
    const typeboxErrors = JSON.parse(error.message || "{}")
      .errors as ValueError[];

    errors = typeboxErrors.map((e) => ({
      title: e.path,
      description: e.message,
    }));
  } catch (e) {
    errors = [
      { title: error.error, description: error.message, params: error?.params },
    ];
  }

  for (const err of errors) {
    let title = "";
    try {
      title = t
        ? t(`MAIN.ERROR.${err.title}` as TranslationKey, err.params)
        : err.title;
    } catch (e) {
      title = err.title;
    }

    let description = "";
    try {
      description = t
        ? t(err.description as TranslationKey, err.params)
        : err.description || ""!;
    } catch (e) {
      description = err.description || "";
    }

    toast.error(title, {
      description,
      duration: 5000,
    });

    if (process.env.NODE_ENV === "production") console.clear();
  }
}
