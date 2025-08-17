"use client";

import { rpc } from "@/app/api/[[...route]]/rpc";
import { useEffect, useState } from "react";

type TeamMember = {
  displayAvatarURL: string;
  username: string;
  global_name: string;
  display_name: string;
  memberRoles: string[];
};

export default function TeamView() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    async function fetchTeam() {
      try {
        const response = await rpc.api.team.get();

        const membersWithRoles = response.data.map((member: any) => ({
          ...member,
          roles: Array.isArray(member.roles) ? member.roles : [],
        }));

        setTeamMembers(membersWithRoles);
      } catch (err) {
        console.error("Error fetching team:", err);
      }
    }

    fetchTeam();
  }, []);

  return (
    <div className="flex flex-col bg-black w-300 -left-55 text-white p-6 absolute -top-15 max-h-fit overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-700 scrollbar-thumb-rounded">
      <div className="flex-1 px-6 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {teamMembers.length > 0 ? (
            teamMembers.map((member) => (
              <div
                key={member.username}
                className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                {/* Avatar */}
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={member.displayAvatarURL}
                    alt={member.global_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Información */}
                <div className="p-4">
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
 
                  <div className="font-semibold text-white text-lg">
                    {member.global_name}
                  </div>
 
                  <div className="text-sm text-gray-400">
                    {member.display_name}
                  </div>
 
                  <div className="mt-3 flex flex-wrap gap-1">
                    {member.memberRoles.includes("Owner") && (
                      <span className="flex items-center text-xs px-2 py-1 text-purple-500   rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.122a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.122a1 1 0 00-1.175 0l-3.976 2.122c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.122c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Owner
                      </span>
                    )}
                    {member.memberRoles.includes("Admin") && (
                      <span className="flex items-center text-xs px-2 py-1 text-yellow-500 rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        Admin
                      </span>
                    )}
                    {member.memberRoles.includes("Helper") && (
                      <span className="flex items-center text-xs px-2 py-1 text-blue-500 rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        Helper
                      </span>
                    )}
                    {member.memberRoles.includes("Techlead") && (
                      <span className="flex items-center text-xs px-2 py-1  text-orange-500  rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        Techlead
                      </span>
                    )}
                    {member.memberRoles.includes("Booster") && (
                      <span className="flex items-center text-xs px-2 py-1 text-pink-500 rounded">
                        <svg
                          className="w-3 h-3 mr-1"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        Booster
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 col-span-full text-center">
              Loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
