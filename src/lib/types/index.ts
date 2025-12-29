import { GetApiByGuildIdBoardByBoardType200ItemBoardType } from "@/openapi";

export type BoardType =
  | GetApiByGuildIdBoardByBoardType200ItemBoardType
  | "marketplace";

export type MarketplaceBoardType = Exclude<
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
  "showcase"
>;
