import { Static, Type as t } from "@sinclair/typebox";
import { PAGEABLE_LIMIT } from "../config/constants";

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

// const TString = t.Codec(t.String())
// .Decode((value) => {
//   if (value === "null" || value === "undefined" || value === "") return null;
//   return value;
// })
// .Encode((value) => {
//   if (value === null) return "null";
//   if (value === undefined) return "undefined";
//   return value;
// });

export const pageable = t.Object({
  cursor: t.Optional(TString),
  limit: t.Optional(t.Number({ default: PAGEABLE_LIMIT })),
});

export type Pageable = Static<typeof pageable>;
