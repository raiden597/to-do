"use client";

import { motion } from "framer-motion";

type TodoItemProps = {
  text: string;
  completed: boolean;
  onToggle: () => void;
  onDelete: () => void;
};

export default function TodoItem({
  text,
  completed,
  onToggle,
  onDelete,
}: TodoItemProps) {
  const swipeConfidenceThreshold = 80;

  const handleSwipe = (offsetX: number) => {
    if (offsetX < -swipeConfidenceThreshold) {
      navigator.vibrate?.(50);
      onDelete();
    } else if (offsetX > swipeConfidenceThreshold) {
      navigator.vibrate?.(30);
      onToggle();
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.2}
      onDragEnd={(_, info) => handleSwipe(info.offset.x)}
      whileDrag={{ scale: 0.96, opacity: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex items-center justify-between px-4 py-4 rounded-2xl bg-white/10 backdrop-blur-xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1)] transition-all group cursor-grab active:cursor-grabbing"
    >
      <span
        onClick={onToggle}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onToggle()}
        className={`flex-1 cursor-pointer select-none text-base font-semibold tracking-tight text-[var(--foreground)] transition-opacity outline-none ${
          completed ? "line-through opacity-40" : ""
        }`}
      >
        {text}
      </span>
      <button
        onClick={onDelete}
        aria-label="Delete task"
        className="ml-4 text-red-500 hover:text-red-400 transition-colors text-xl opacity-70 hover:opacity-100"
      >
        ✕
      </button>
    </motion.div>
  );
}
