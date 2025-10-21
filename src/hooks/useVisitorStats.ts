import { useState, useEffect } from 'react';
import { VisitorStats } from '@/types';

const LOCAL_STORAGE_KEY = 'blogVisitorStats';

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>(() => {
    const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedStats) {
      return JSON.parse(storedStats);
    }
    return {
      dailyVisitors: 0,
      totalVisitors: 0,
      lastVisitDate: getTodayDate(),
    };
  });

  useEffect(() => {
    const today = getTodayDate();
    let currentStats = { ...stats };

    if (currentStats.lastVisitDate !== today) {
      // New day, reset daily visitors
      currentStats.dailyVisitors = 0;
      currentStats.lastVisitDate = today;
    }

    // Increment counts for the current visit
    currentStats.dailyVisitors += 1;
    currentStats.totalVisitors += 1;

    setStats(currentStats);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentStats));
  }, []); // Run only once on mount

  return stats;
};
