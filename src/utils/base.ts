import type { EdenFetchError } from "@elysiajs/eden/dist/errors";
import {
  DefaultErrorFunction,
  Errors,
  SetErrorFunction,
} from "@sinclair/typebox/errors";
import type { Static, TSchema } from "@sinclair/typebox/type";
import { Convert } from "@sinclair/typebox/value";

SetErrorFunction((error) => {
  if (typeof error.schema.error === "string") return error.schema.error;
  return DefaultErrorFunction(error);
});

export function parseCookie(cookie: string, key: string): string | undefined {
  const match = cookie.match(new RegExp(`(^| )${key}=([^;]+)`));
  return match?.[2];
}

export const parse = <T extends TSchema>(
  schema: T,
  value: unknown,
): Static<T> => {
  const convert = Convert(schema, value);
  if (!convert) throw new Error(Errors(schema, value).First()?.message);
  return convert;
};

export function handleEden<T>(
  response: (
    | {
        data: T;
        error: null;
      }
    | {
        data: null;
        error: EdenFetchError<number, string>;
      }
  ) & {
    status: number;
    response: Record<number, unknown>;
    headers: Record<string, string>;
  },
): T {
  if (response.error) throw response.error;
  return response.data;
}
