"use client"

import { useTheme } from "@/components/common/theme-provider"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button onClick={toggleTheme} className="px-4 py-2 border rounded-md">
      {theme === 'dark' ? 'Light' : 'Dark'} Mode
    </button>
  )
}
