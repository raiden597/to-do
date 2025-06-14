"use client";

import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import { Moon, Sun } from 'lucide-react';

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
  className={`w-14 h-8 flex items-center px-1 rounded-full transition-colors duration-300 ${
    darkMode ? 'bg-white/10' : 'bg-white/50'
  }`}
  aria-label="Toggle dark mode"
>
  <div
    className={`w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ease-in-out flex items-center justify-center ${
      darkMode
        ? 'translate-x-6 bg-white text-yellow-500'
        : 'translate-x-0 bg-white text-blue-500'
    }`}
  >
    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
  </div>
</button>

      </div>

      <div className="w-full max-w-xl">
        <TodoList />
      </div>
    </main>
  );
}
