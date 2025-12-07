"use client";

import Image from "next/image";
import { useState } from "react";

type TeamMember = {
  displayAvatarURL: string;
  username: string;
  globalName: string;
  display_name: string;
  memberRoles: string[];
};

type ApiResponse = {
  data: TeamMember[] | { members?: TeamMember[] } | null | undefined;
};

export function Team() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  // useEffect(() => {
  //   async function fetchTeam() {
  //     try {
  //       const response = (await rpc.api.team.get()) as ApiResponse;

  //       let members: TeamMember[] = [];

  //       if (Array.isArray(response.data)) {
  //         members = response.data;
  //       } else if (response.data && typeof response.data === "object") {
  //         members = (response.data as { members?: TeamMember[] }).members || [];
  //       } else {
  //         console.warn("Formato inesperado de datos:", response.data);
  //         members = [];
  //       }

  //       const membersWithRoles = members.map((member) => ({
  //         ...member,
  //         roles: Array.isArray(member.memberRoles) ? member.memberRoles : [],
  //       }));

  //       setTeamMembers(membersWithRoles);
  //     } catch (err) {
  //       console.error("Error fetching team:", err);
  //       setTeamMembers([]);
  //     }
  //   }

  //   fetchTeam();
  // }, []);

  return (
    <div className="absolute top-30 left-0 z-10 min-h-screen w-full text-white">
      {/* Header centrado */}
      <div className="flex justify-center p-6"></div>

      {/* Grid de miembros */}
      <div className="px-4 pb-8 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 sm:grid-cols-1 sm:gap-6 md:grid-cols-1 lg:grid-cols-4">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.username}
                className="overflow-hidden rounded-lg border border-red-700 shadow-lg backdrop-blur-2xl transition-shadow duration-300 hover:shadow-xl"
              >
                {/* Avatar */}
                <div className="relative h-48 overflow-hidden sm:h-56">
                  <Image
                    src={member.displayAvatarURL}
                    alt={member.globalName}
                    className="h-full w-full object-cover"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                </div>

                {/* Información */}
                <div className="p-3 sm:p-4">
                  {/* Username */}
                  <div className="mb-2 flex items-center space-x-1">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                    </svg>
                    <span className="text-sm text-gray-400">
                      {member.username}
                    </span>
                  </div>

                  {/* Global Name */}
                  {/* <div className="font-semibold text-white text-base sm:text-lg">{member.globalName}</div> */}

                  {/* Display Name */}
                  <div className="mt-1 text-sm text-gray-400">
                    {member.display_name}
                  </div>

                  {/* Roles */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.memberRoles.includes("Owner") && (
                      <span className="flex items-center px-2 py-1 text-xs text-purple-400">
                        <span className="mr-1">★</span> Owner
                      </span>
                    )}
                    {member.memberRoles.includes("Admin") && (
                      <span className="flex items-center px-2 py-1 text-xs text-yellow-400">
                        <span className="mr-1">○</span> Admin
                      </span>
                    )}
                    {member.memberRoles.includes("Techlead") && (
                      <span className="flex items-center px-2 py-1 text-xs text-orange-400">
                        <span className="mr-1">⚙️</span> Techlead
                      </span>
                    )}
                    {member.memberRoles.includes("Booster") && (
                      <span className="flex items-center px-2 py-1 text-xs text-pink-400">
                        <span className="mr-1">○</span> Booster
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="col-span-full py-4 text-center text-gray-400"></p>
          )}
        </div>
      </div>
    </div>
  );
}
