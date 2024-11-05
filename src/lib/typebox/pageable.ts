import { Static, t } from "elysia";

const T = t
  .Transform(t.String())
  .Decode((value) => {
    if (value === "null" || value === "undefined" || value === "") return null;
    return value;
  })
  .Encode((value) => {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    return value;
  });

export const pageable = t.Object({
  cursor: t.Optional(t.Nullable(T)),
});

export type Pageable = Static<typeof pageable>;
