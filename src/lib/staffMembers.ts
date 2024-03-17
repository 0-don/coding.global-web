import { AiFillBug, AiFillCode, AiFillCrown } from "solid-icons/ai";
import { FiHelpCircle } from "solid-icons/fi";
import { MemberRole } from "../types";

export const STAFF_MEMBERS: MemberRole[] = [
  {
    role: "Owner",
    color: "text-red-500",
    Icon: AiFillCrown,
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
  {
    role: "Helper",
    color: "text-blue-500",
    Icon: FiHelpCircle,
  },
];
