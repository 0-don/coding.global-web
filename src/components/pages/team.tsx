"use client";

import { useTeamQuery } from "@/hook/bot-hook";
import {
  Card,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import Image from "next/image";
import { FaBug, FaCode, FaCrown, FaGlobe, FaUserPlus } from "react-icons/fa";
import { HiMiniSparkles } from "react-icons/hi2";
import { MdHelpCenter, MdSupportAgent } from "react-icons/md";
import { IconType } from "react-icons";
import { cn } from "@/lib/utils";

type MemberRole = {
  role: string;
  color: string;
  Icon: IconType;
};

const STAFF_ROLES: MemberRole[] = [
  {
    role: "Owner",
    color: "text-red-500",
    Icon: FaCrown,
  },
  {
    role: "Moderator",
    color: "text-green-500",
    Icon: FaBug,
  },
  {
    role: "Admin",
    color: "text-yellow-500",
    Icon: FaCode,
  },
  {
    role: "Helper",
    color: "text-blue-500",
    Icon: MdHelpCenter,
  },
  {
    role: "Techlead",
    color: "text-orange-500",
    Icon: MdSupportAgent,
  },
  {
    role: "Booster",
    color: "text-pink-600",
    Icon: HiMiniSparkles,
  },
];

export function Team() {
  const teamQuery = useTeamQuery();

  if (teamQuery.isPending) {
    return (
      <div className="container mx-auto mt-5">
        <div className="text-center text-muted-foreground">Loading team members...</div>
      </div>
    );
  }

  if (teamQuery.isError) {
    return (
      <div className="container mx-auto mt-5">
        <div className="text-center text-destructive">
          Error loading team members: {teamQuery.error.message}
        </div>
      </div>
    );
  }

  const staffMembers = teamQuery.data ?? [];

  return (
    <div className="container mx-auto mt-5">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {staffMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="p-0 gap-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                <Image
                  src={member.displayAvatarURL}
                  alt={member.username}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 14vw"
                />
              </div>

              <div className="p-6 space-y-2">
                <CardDescription className="flex items-center space-x-1">
                  <FaUserPlus className="h-3.5 w-3.5" />
                  <span>{member.username}</span>
                </CardDescription>

                {member.globalName && (
                  <CardDescription className="flex items-center space-x-1">
                    <FaGlobe className="h-3.5 w-3.5" />
                    <span className="font-bold">{member.globalName}</span>
                  </CardDescription>
                )}

                <CardDescription className="flex flex-wrap gap-2 pt-2">
                  {member.memberRoles.map((staffRole) => {
                    const role = STAFF_ROLES.find(
                      (r) => r.role.toLowerCase() === staffRole.toLowerCase()
                    );

                    if (!role) return null;

                    return (
                      <span
                        key={staffRole}
                        className={cn("flex items-center gap-1 text-xs", role.color)}
                      >
                        <role.Icon />
                        {role.role}
                      </span>
                    );
                  })}
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
