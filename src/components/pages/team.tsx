"use client";

import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { useTeamQuery } from "@/hook/bot-hook";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { FaGlobe, FaUserPlus } from "react-icons/fa";
import { RiTeamFill } from "react-icons/ri";
import { STAFF_ROLES } from "../elements/utils/enums";

export function Team() {
  const t = useTranslations();
  const teamQuery = useTeamQuery();

  const staffMembers = teamQuery.data ?? [];

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="flex items-center justify-center gap-2 py-6">
        <RiTeamFill className="text-3xl" />
        <h1 className="text-3xl font-bold">{t("TEAM.HEADING")}</h1>
      </div>

      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">
        {staffMembers.map((member) => (
          <Card key={member.id}>
            <CardHeader className="gap-0 p-0">
              <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
                <Image
                  src={member.displayAvatarURL}
                  alt={member.username}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 14vw"
                />
              </div>

              <div className="space-y-2 p-6">
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
                      (r) => r.role.toLowerCase() === staffRole.toLowerCase(),
                    );

                    if (!role) return null;

                    return (
                      <span
                        key={staffRole}
                        className={cn(
                          "flex items-center gap-1 text-xs",
                          role.color,
                        )}
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
