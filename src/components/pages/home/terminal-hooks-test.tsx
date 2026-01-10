"use client";

import { useState, useEffect } from "react";
import {
  useTerminalMembersQuery,
  useTerminalTopQuery,
  useTerminalUserSearchQuery,
  useTerminalUserQuery,
} from "@/hook/terminal-hook";

export function TerminalHooksTest() {
  const [searchQuery, setSearchQuery] = useState("");
  const [userId, setUserId] = useState("");

  const membersQuery = useTerminalMembersQuery();
  const topQuery = useTerminalTopQuery({ limit: 10 });
  const userSearchQuery = useTerminalUserSearchQuery({ q: searchQuery });
  const userQuery = useTerminalUserQuery(userId);

  useEffect(() => {
    console.log("=== Terminal Members ===");
    console.log("Loading:", membersQuery.isLoading);
    console.log("Error:", membersQuery.error);
    console.log("Data:", membersQuery.data);
  }, [membersQuery.isLoading, membersQuery.error, membersQuery.data]);

  useEffect(() => {
    console.log("=== Terminal Top ===");
    console.log("Loading:", topQuery.isLoading);
    console.log("Error:", topQuery.error);
    console.log("Data:", topQuery.data);
  }, [topQuery.isLoading, topQuery.error, topQuery.data]);

  useEffect(() => {
    if (searchQuery.length > 0) {
      console.log("=== Terminal User Search ===");
      console.log("Query:", searchQuery);
      console.log("Loading:", userSearchQuery.isLoading);
      console.log("Error:", userSearchQuery.error);
      console.log("Data:", userSearchQuery.data);
    }
  }, [
    searchQuery,
    userSearchQuery.isLoading,
    userSearchQuery.error,
    userSearchQuery.data,
  ]);

  useEffect(() => {
    if (userId.length > 0) {
      console.log("=== Terminal User ===");
      console.log("User ID:", userId);
      console.log("Loading:", userQuery.isLoading);
      console.log("Error:", userQuery.error);
      console.log("Data:", userQuery.data);
    }
  }, [userId, userQuery.isLoading, userQuery.error, userQuery.data]);

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <h2 className="text-2xl font-bold">Terminal Hooks Test</h2>

      {/* Members Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">useTerminalMembersQuery</h3>
        <div className="space-y-1 text-sm">
          <p>
            Status:{" "}
            {membersQuery.isLoading
              ? "Loading..."
              : membersQuery.error
                ? "Error"
                : "Success"}
          </p>
          {membersQuery.error && (
            <p className="text-red-500">
              Error: {String(membersQuery.error.message)}
            </p>
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
        <div className="space-y-1 text-sm">
          <p>
            Status:{" "}
            {topQuery.isLoading
              ? "Loading..."
              : topQuery.error
                ? "Error"
                : "Success"}
          </p>
          {topQuery.error && (
            <p className="text-red-500">Error: {String(topQuery.error.message)}</p>
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
        <h3 className="mb-2 text-lg font-semibold">useTerminalUserSearchQuery</h3>
        <input
          type="text"
          placeholder="Search for a user..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-input bg-background mb-2 w-full rounded border px-3 py-2"
        />
        <div className="space-y-1 text-sm">
          {searchQuery.length > 0 && (
            <>
              <p>
                Status:{" "}
                {userSearchQuery.isLoading
                  ? "Loading..."
                  : userSearchQuery.error
                    ? "Error"
                    : "Success"}
              </p>
              {userSearchQuery.error && (
                <p className="text-red-500">
                  Error: {String(userSearchQuery.error.message)}
                </p>
              )}
              {userSearchQuery.data && (
                <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
                  {JSON.stringify(userSearchQuery.data, null, 2)}
                </pre>
              )}
            </>
          )}
          {searchQuery.length === 0 && (
            <p className="text-muted-foreground">
              Type something to search for users
            </p>
          )}
        </div>
      </div>

      {/* User By ID Section */}
      <div className="rounded-lg border p-4">
        <h3 className="mb-2 text-lg font-semibold">useTerminalUserQuery</h3>
        <input
          type="text"
          placeholder="Enter user ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="border-input bg-background mb-2 w-full rounded border px-3 py-2"
        />
        <div className="space-y-1 text-sm">
          {userId.length > 0 && (
            <>
              <p>
                Status:{" "}
                {userQuery.isLoading
                  ? "Loading..."
                  : userQuery.error
                    ? "Error"
                    : "Success"}
              </p>
              {userQuery.error && (
                <p className="text-red-500">
                  Error: {String(userQuery.error.message)}
                </p>
              )}
              {userQuery.data && (
                <pre className="bg-muted mt-2 max-h-40 overflow-auto rounded p-2">
                  {JSON.stringify(userQuery.data, null, 2)}
                </pre>
              )}
            </>
          )}
          {userId.length === 0 && (
            <p className="text-muted-foreground">Enter a user ID to fetch</p>
          )}
        </div>
      </div>
    </div>
  );
}
