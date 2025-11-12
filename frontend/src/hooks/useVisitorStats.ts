"use client";

import { useState, useEffect, useRef } from 'react';
import { VisitorStats } from '../types'; // Adjusted path

export const useVisitorStats = () => {
  const [stats, setStats] = useState<VisitorStats>({
    dailyVisitors: 0,
    yesterdayVisitors: 0,
    totalVisitors: 0,
  });
  const effectRan = useRef(false);

  useEffect(() => {
    const recordAndFetchStats = async () => {
      try {
        // Record the visit. The backend will decide whether to count it.
        await fetch('http://localhost:3001/api/stats/visit', { method: 'POST', credentials: 'include' });

        // Fetch the latest stats
        const response = await fetch('http://localhost:3001/api/stats/visitors', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('Failed to fetch visitor stats');
        }
        const data = await response.json();
        setStats(data);
      } catch (error: any) { // Added any for error type
        console.error('Error with visitor stats:', error);
      }
    };

    if (process.env.NODE_ENV === 'development') {
      if (effectRan.current === false) {
        recordAndFetchStats();
        effectRan.current = true;
      }
    } else {
      recordAndFetchStats();
    }
  }, []); // Run only once on mount

  return stats;
};
