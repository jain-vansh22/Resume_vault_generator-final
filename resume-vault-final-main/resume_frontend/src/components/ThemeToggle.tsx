"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const currentTheme = savedTheme || "dark"; // Default to dark
    setTheme(currentTheme);
    document.documentElement.setAttribute("data-theme", currentTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(currentTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-full border border-[var(--glass-border)] bg-[var(--glass-bg)] px-3 py-1.5 shadow-lg backdrop-blur-md transition-all duration-300">
      {/* Sun Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={`h-4 w-4 transition-colors duration-300 ${theme === "light" ? "text-amber-500" : "text-slate-500"}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21m8.97-8.97h-2.25M4.125 12h2.25m14.485-6.72l-1.59 1.59m-11.83 11.83l-1.59 1.59m11.83 0l1.59-1.59m-11.83-11.83l1.59-1.59M12 18.75a6.75 6.75 0 1 0 0-13.5 6.75 6.75 0 0 0 0 13.5Z" />
      </svg>
      
      {/* Pill Toggle Switch Track */}
      <button
        onClick={toggleTheme}
        className="relative h-5 w-9 rounded-full bg-slate-300 dark:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        aria-label="Toggle Theme"
      >
        {/* Sliding Switch Knob */}
        <span
          className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-300 ${
            theme === "dark" ? "translate-x-4 bg-indigo-400" : "translate-x-0"
          }`}
        />
      </button>

      {/* Moon Icon */}
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={`h-4 w-4 transition-colors duration-300 ${theme === "dark" ? "text-indigo-400" : "text-slate-500"}`}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
      </svg>
    </div>
  );
}
