import { Static, Type as t } from "@sinclair/typebox";

const TString = t
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
  cursor: t.Optional(t.Nullable(TString)),
  limit: t.Optional(t.Nullable(t.Number({ default: 20 }))),
});

export type Pageable = Static<typeof pageable>;
