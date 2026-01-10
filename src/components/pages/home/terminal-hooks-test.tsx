"use client";

import {
  useTerminalMembersQuery,
  useTerminalTopQuery,
  useTerminalUserQuery,
  useTerminalUserSearchQuery,
} from "@/hook/terminal-hook";
import { useState } from "react";

export function TerminalHooksTest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");

  const membersQuery = useTerminalMembersQuery();
  const topQuery = useTerminalTopQuery();
  const userSearchQuery = useTerminalUserSearchQuery();
  const userQuery = useTerminalUserQuery();

  const handleFetchMembers = async () => {
    await membersQuery.fetch();
  };

  const handleFetchTop = async () => {
    await topQuery.fetch({ limit: 10 });
  };

  const handleSearch = async () => {
    if (!searchQuery) return;
    await userSearchQuery.fetch({ q: searchQuery });
  };

  const handleFetchUser = async () => {
    if (!userId) return;
    await userQuery.fetch(userId);
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h2 className="text-2xl font-bold">Terminal Hooks Test</h2>

      {/* Members Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">useTerminalMembersQuery</h3>
        <button
          onClick={handleFetchMembers}
          disabled={membersQuery.isLoading}
          className="bg-primary text-primary-foreground mb-2 rounded px-4 py-2 disabled:opacity-50"
        >
          {membersQuery.isLoading ? "Loading..." : "Fetch Members"}
        </button>
        <div className="space-y-1 text-sm">
          {membersQuery.error && (
            <p className="text-red-500">Error: {membersQuery.error.message}</p>
          )}
          {membersQuery.data && (
            <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
              {JSON.stringify(membersQuery.data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Top Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">
          useTerminalTopQuery (limit: 10)
        </h3>
        <button
          onClick={handleFetchTop}
          disabled={topQuery.isLoading}
          className="bg-primary text-primary-foreground mb-2 rounded px-4 py-2 disabled:opacity-50"
        >
          {topQuery.isLoading ? "Loading..." : "Fetch Top"}
        </button>
        <div className="space-y-1 text-sm">
          {topQuery.error && (
            <p className="text-red-500">Error: {topQuery.error.message}</p>
          )}
          {topQuery.data && (
            <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
              {JSON.stringify(topQuery.data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* User Search Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">
          useTerminalUserSearchQuery
        </h3>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Search for a user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-input bg-background flex-1 rounded border px-3 py-2"
          />
          <button
            onClick={handleSearch}
            disabled={userSearchQuery.isLoading || !searchQuery}
            className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
          >
            {userSearchQuery.isLoading ? "Loading..." : "Search"}
          </button>
        </div>
        <div className="space-y-1 text-sm">
          {userSearchQuery.error && (
            <p className="text-red-500">
              Error: {userSearchQuery.error.message}
            </p>
          )}
          {userSearchQuery.data && (
            <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
              {JSON.stringify(userSearchQuery.data, null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* User By ID Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">useTerminalUserQuery</h3>
        <div className="mb-2 flex gap-2">
          <input
            type="text"
            placeholder="Enter user ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="border-input bg-background flex-1 rounded border px-3 py-2"
          />
          <button
            onClick={handleFetchUser}
            disabled={userQuery.isLoading || !userId}
            className="bg-primary text-primary-foreground rounded px-4 py-2 disabled:opacity-50"
          >
            {userQuery.isLoading ? "Loading..." : "Fetch User"}
          </button>
        </div>
        <div className="space-y-1 text-sm">
          {userQuery.error && (
            <p className="text-red-500">Error: {userQuery.error.message}</p>
          )}
          {userQuery.data && (
            <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
              {JSON.stringify(userQuery.data, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
