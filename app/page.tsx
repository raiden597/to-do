"use client";

import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    setDarkMode(stored === "dark");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <main className="min-h-screen transition-colors flex flex-col items-center justify-center px-4 py-8 sm:py-12">
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="rounded-full px-3 py-1 bg-white/30 dark:bg-white/10 text-[var(--foreground)] backdrop-blur-md border border-white/20 text-sm shadow"
          aria-label="Toggle dark mode"
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>
      </div>

      <div className="w-full max-w-xl">
        <TodoList />
      </div>
    </main>
  );
}
