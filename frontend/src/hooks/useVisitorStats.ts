import { useState, useEffect } from 'react';
import { VisitorStats } from '@/types';

const LOCAL_STORAGE_KEY = 'blogVisitorStats';

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
};

const getYesterdayDate = (): string => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>(() => {
    const storedStats = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (storedStats) {
      return JSON.parse(storedStats);
    }
    return {
      dailyVisitors: 0,
      totalVisitors: 0,
      yesterdayVisitors: 0,
      lastVisitDate: getTodayDate(),
    };
  });

  useEffect(() => {
    const today = getTodayDate();
    const yesterday = getYesterdayDate();
    let currentStats = { ...stats };

    if (currentStats.lastVisitDate !== today) {
      if (currentStats.lastVisitDate === yesterday) {
        // The last visit was yesterday, so today's daily becomes yesterday's
        currentStats.yesterdayVisitors = currentStats.dailyVisitors;
      } else {
        // More than a day has passed, reset yesterday's count
        currentStats.yesterdayVisitors = 0;
      }
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
