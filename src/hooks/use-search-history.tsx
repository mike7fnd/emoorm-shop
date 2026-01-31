
'use client';

import { useState, useEffect, useCallback } from 'react';

const MAX_HISTORY_LENGTH = 5;
const STORAGE_KEY = 'search-history';

export function useSearchHistory() {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(STORAGE_KEY);
      if (storedHistory) {
        setSearchHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error("Failed to parse search history from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(searchHistory));
      } catch (error) {
        console.error("Failed to save search history to localStorage", error);
      }
    }
  }, [searchHistory, isInitialized]);

  const addSearchTerm = useCallback((term: string) => {
    if (!term.trim()) return;

    setSearchHistory(prevHistory => {
      const newHistory = [term, ...prevHistory.filter(t => t.toLowerCase() !== term.toLowerCase())];
      return Array.from(new Set(newHistory)).slice(0, MAX_HISTORY_LENGTH);
    });
  }, []);

  const clearSearchHistory = useCallback(() => {
      setSearchHistory([]);
  }, []);

  return { searchHistory, addSearchTerm, clearSearchHistory };
}
