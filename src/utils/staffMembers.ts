import { MemberRole } from "../types";
import { RiFinanceVipCrownFill } from "solid-icons/ri";
import { AiFillCode } from "solid-icons/ai";
import { AiFillBug } from "solid-icons/ai";

export const staffMembers: MemberRole[] = [
  {
    role: "Owner",
    color: "text-red-500",
    Icon: RiFinanceVipCrownFill,
  },
  {
    role: "Moderator",
    color: "text-green-500",
    Icon: AiFillBug,
  },
  {
    role: "Admin",
    color: "text-yellow-500",
    Icon: AiFillCode,
  },
];
