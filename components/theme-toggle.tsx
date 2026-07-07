"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return <div className="h-10 w-16" />;

  const isDark = theme === "dark";

  return (
    <button
      aria-label="Переключить тему"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative h-10 w-16 rounded-full bg-white/60 dark:bg-white/10 border border-white/70 dark:border-white/15 backdrop-blur-md shadow-glass dark:shadow-glass-dark flex items-center px-1 transition-colors"
    >
      <motion.div
        className="h-8 w-8 rounded-full bg-gradient-to-br from-plum-400 to-bloom-500 flex items-center justify-center text-white shadow-float"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.div>
    </button>
  );
}
