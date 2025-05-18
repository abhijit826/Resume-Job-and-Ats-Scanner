'use client';

import { useState, useEffect, useCallback } from 'react';

const SAVED_JOBS_KEY = 'careerCompassSavedJobs';

export function useSavedJobs() {
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(SAVED_JOBS_KEY);
        setSavedJobIds(item ? JSON.parse(item) : []);
      } catch (error) {
        console.error("Error reading saved jobs from localStorage", error);
        setSavedJobIds([]);
      }
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SAVED_JOBS_KEY, JSON.stringify(savedJobIds));
      } catch (error) {
        console.error("Error saving jobs to localStorage", error);
      }
    }
  }, [savedJobIds, isInitialized]);

  const addSavedJob = useCallback((jobId: string) => {
    setSavedJobIds((prevIds) => {
      if (!prevIds.includes(jobId)) {
        return [...prevIds, jobId];
      }
      return prevIds;
    });
  }, []);

  const removeSavedJob = useCallback((jobId: string) => {
    setSavedJobIds((prevIds) => prevIds.filter((id) => id !== jobId));
  }, []);

  const isJobSaved = useCallback((jobId: string) => {
    return savedJobIds.includes(jobId);
  }, [savedJobIds]);

  return { savedJobIds, addSavedJob, removeSavedJob, isJobSaved, isInitialized };
}
