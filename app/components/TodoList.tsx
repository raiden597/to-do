'use client';

import { useState, useEffect, useCallback } from 'react';
import TodoItem from './TodoItem';
import { AnimatePresence, Reorder } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import { createEvents, EventAttributes } from 'ics';

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  // Load from localStorage once on mount
  useEffect(() => {
    const stored = localStorage.getItem('todos');
    if (stored) {
      try {
        setTodos(JSON.parse(stored));
      } catch (e) {
        console.error('Invalid todos in localStorage');
      }
    }
  }, []);

  // Save todos to localStorage
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = useCallback(() => {
    const trimmed = task.trim();
    if (!trimmed) return;
    setTodos((prev) => [
      ...prev,
      { id: uuidv4(), text: trimmed, completed: false },
    ]);
    setTask('');
  }, [task]);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

const exportToCalendar = () => {
  if (todos.length === 0) {
    alert('No tasks to export!');
    return;
  }

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + 1); // start from tomorrow

  const events: EventAttributes[] = todos.map((todo, index) => {
    const totalHour = 9 + index;
    const dayOffset = Math.floor(totalHour / 24);
    const hour = totalHour % 24;

    const eventDate = new Date(baseDate);
    eventDate.setDate(baseDate.getDate() + dayOffset);

    const start: [number, number, number, number, number] = [
      eventDate.getFullYear(),
      eventDate.getMonth() + 1, // ics expects 1-based months
      eventDate.getDate(),
      hour,
      0,
    ];

    return {
      title: todo.text,
      start,
      duration: { hours: 1 },
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
    };
  });

  createEvents(events, (error, value) => {
    if (error) {
      console.error('Error generating calendar file:', error);
      return;
    }

    const blob = new Blob([value], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos.ics';
    link.click();
  });
};

  return (
    <div className="bg-white/10 dark:bg-white/10 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 w-full max-w-xl mx-auto shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
      <h1 className="text-3xl sm:text-4xl font-semibold text-center text-[var(--foreground)] mb-6 sm:mb-8 tracking-tight drop-shadow-sm">
        📝 To-Do
      </h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-2">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          aria-label="Task input"
          className="w-full px-5 py-3 rounded-[1.5rem] bg-white/10 text-[var(--foreground)] placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner transition-all"
          maxLength={100}
          autoFocus
        />
        <button
          onClick={addTodo}
          className="px-6 py-3 rounded-[1.5rem] bg-blue-500 hover:bg-blue-600 active:scale-95 text-white shadow-md transition-transform duration-150"
        >
          Add
        </button>
        
      </div>
      <button
        onClick={exportToCalendar}
        className="w-full mb-2 px-6 py-3 rounded-[1.5rem] bg-green-500 hover:bg-green-600 active:scale-95 text-white shadow-md transition-transform duration-150"
      >
        📅 Export to Calendar
      </button>
      <p className="text-center text-xs text-zinc-400 mb-4 sm:mb-6">
  (Swipe ➡ to complete, ⬅ to delete)
</p>
      


      {todos.length === 0 ? (
        <p className="text-center text-zinc-500 mt-6 text-base">
          No tasks yet. Add one above!
        </p>
        
      ) : (
        <Reorder.Group
          axis="y"
          values={todos}
          onReorder={setTodos}
          className="space-y-4"
        >
          <AnimatePresence initial={false}>
            {todos.map((todo) => (
              <Reorder.Item
                key={todo.id}
                value={todo}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="cursor-grab active:cursor-grabbing"
              >
                <TodoItem
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={() => toggleTodo(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              </Reorder.Item>
            ))}
          </AnimatePresence>
        </Reorder.Group>
      )}
    </div>
  );
}
