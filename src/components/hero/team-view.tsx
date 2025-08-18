"use client";

import { rpc } from "@/lib/rpc";
import { useEffect, useState } from "react";

type TeamMember = {
  displayAvatarURL: string;
  username: string;
  globalName: string;
  display_name: string;
  memberRoles: string[];
};

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await rpc.api.team.get();

        let members: any[] = [];

        if (Array.isArray(response.data)) {
          members = response.data;
        } else if (response.data && typeof response.data === "object") {
          members = response.data.members || [];
        } else {
          console.warn("Formato inesperado de datos:", response.data);
          members = [];
        }

        const membersWithRoles = members.map((member) => ({
          ...member,
          roles: Array.isArray(member.roles) ? member.roles : [],
        }));

        setTeamMembers(membersWithRoles);
      } catch (err) {
        console.error("Error fetching team:", err);
        setTeamMembers([]);
      }
    }

    fetchTeam();
  }, []);

  return (
    <div className="min-h-screen w-full -left-0 absolute top-30 z-10   text-white">
      {/* Header centrado */}
      <div className="p-6 flex justify-center"></div>

      {/* Grid de miembros */}
      <div className="px-4 sm:px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-7xl mx-auto">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.username}
                className="backdrop-blur-2xl border border-red-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Avatar */}
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <img
                    src={member.displayAvatarURL}
                    alt={member.globalName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información */}
                <div className="p-3 sm:p-4">
                  {/* Username */}
                  <div className="flex items-center space-x-1 mb-2">
                    <svg
                      className="w-4 h-4 text-gray-400"
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
                  <div className="text-sm text-gray-400 mt-1">
                    {member.display_name}
                  </div>

                  {/* Roles */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.memberRoles.includes("Owner") && (
                      <span className="flex items-center text-xs px-2 py-1 text-purple-400">
                        <span className="mr-1">★</span> Owner
                      </span>
                    )}
                    {member.memberRoles.includes("Admin") && (
                      <span className="flex items-center text-xs px-2 py-1 text-yellow-400">
                        <span className="mr-1">○</span> Admin
                      </span>
                    )}
                    {member.memberRoles.includes("Techlead") && (
                      <span className="flex items-center text-xs px-2 py-1 text-orange-400">
                        <span className="mr-1">⚙️</span> Techlead
                      </span>
                    )}
                    {member.memberRoles.includes("Booster") && (
                      <span className="flex items-center text-xs px-2 py-1 text-pink-400">
                        <span className="mr-1">○</span> Booster
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center py-4">
               
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
