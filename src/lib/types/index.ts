import { GetApiByGuildIdBoardByBoardType200ItemBoardType } from "@/openapi";

export type MarketplaceBoardType = Exclude<
  GetApiByGuildIdBoardByBoardType200ItemBoardType,
  "showcase"
>;
