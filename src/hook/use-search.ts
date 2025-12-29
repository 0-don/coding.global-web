"use client";

import { search, type Orama, type SearchParams } from "@orama/orama";
import { restore } from "@orama/plugin-data-persistence";
import * as React from "react";

type SearchResult = {
  title: string;
  description: string;
  url: string;
  category: string;
};

type SearchHookResult = {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResult[];
  isLoading: boolean;
  isIndexLoaded: boolean;
};

export function useSearch(): SearchHookResult {
  const [db, setDb] = React.useState<Orama<any> | null>(null);
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isIndexLoaded, setIsIndexLoaded] = React.useState(false);

  React.useEffect(() => {
    async function loadIndex() {
      try {
        const response = await fetch("/search-index.json");
        if (!response.ok) {
          console.warn("Search index not found");
          return;
        }
        const data = await response.json();
        const instance = await restore("json", data);
        setDb(instance as Orama<any>);
        setIsIndexLoaded(true);
      } catch (error) {
        console.error("Failed to load search index:", error);
      }
    }

    loadIndex();
  }, []);

  React.useEffect(() => {
    if (!db || !query.trim()) {
      setResults([]);
      return;
    }

    const searchQuery = async () => {
      setIsLoading(true);
      try {
        const searchResult = await search(db, {
          term: query,
          limit: 10,
        } as SearchParams<any, any>);

        const mappedResults: SearchResult[] = searchResult.hits.map((hit) => ({
          title: hit.document.title as string,
          description: hit.document.description as string,
          url: hit.document.url as string,
          category: hit.document.category as string,
        }));

        setResults(mappedResults);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchQuery, 150);
    return () => clearTimeout(debounceTimer);
  }, [db, query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isIndexLoaded,
  };
}
