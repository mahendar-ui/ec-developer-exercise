"use client";

import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type Filter = "all" | "completed" | "pending";

const STORAGE_KEY = "tasks";

const defaultTasks: Task[] = [
  { id: 1, title: "Fix homepage bug", completed: false },
  { id: 2, title: "Update pricing page", completed: true },
  { id: 3, title: "Add Stripe webhook", completed: false },
  { id: 4, title: "Write documentation", completed: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks ?? []);
  const [filter, setFilter] = useState<Filter>("all");
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setTasks(JSON.parse(stored));
    } catch {
      // Ignore corrupted data
    }
  }, []);

  useEffect(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const toggleTask = (id: number) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addTask = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const title = newTaskTitle.trim();
    if (!title) return;

    const newTask: Task = {
      id: Date.now(),
      title,
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
    setNewTaskTitle("");
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
  ];

  return (
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 px-4 py-16 font-sans dark:bg-zinc-950">
      <main className="w-full max-w-xl">
        <h1
          id="page-heading"
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100"
        >
          Task Manager
        </h1>
        {/* banana */}
        <p
          aria-live="polite"
          className="mt-1 text-sm text-zinc-500 dark:text-zinc-400"
        >
          {completedCount} of {totalCount} tasks completed
        </p>

        {/* Add task form */}
        <form
          onSubmit={addTask}
          className="mt-6 flex gap-2"
          aria-label="Add a new task"
        >
          <label htmlFor="new-task-input" className="sr-only">
            New task title
          </label>
          <input
            id="new-task-input"
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Add a new task..."
            aria-required="true"
            className="flex-1 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder-zinc-500 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950"
          />
          <button
            type="submit"
            className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950"
          >
            Add
          </button>
        </form>

        {/* Filter buttons */}
        <div
          role="group"
          aria-label="Filter tasks"
          className="mt-4 flex gap-1"
        >
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`rounded-md px-3 py-1.5 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950 ${
                filter === f.value
                  ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        <ul
          aria-label={`${filter === "all" ? "All" : filter === "completed" ? "Completed" : "Pending"} tasks`}
          className="mt-4 divide-y divide-zinc-200 dark:divide-zinc-800"
        >
          {filteredTasks.map((task) => (
            <li key={task.id} className="flex items-center gap-3 py-3">
              <input
                type="checkbox"
                id={`task-${task.id}`}
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                aria-label={`Mark "${task.title}" as ${task.completed ? "pending" : "completed"}`}
                className="h-4 w-4 rounded border-zinc-300 text-zinc-900 focus-visible:ring-2 focus-visible:ring-zinc-500 focus-visible:ring-offset-2 dark:border-zinc-600 dark:focus-visible:ring-zinc-400 dark:focus-visible:ring-offset-zinc-950"
              />
              <label
                htmlFor={`task-${task.id}`}
                className={`text-sm ${
                  task.completed
                    ? "text-zinc-400 line-through dark:text-zinc-500"
                    : "text-zinc-800 dark:text-zinc-200"
                }`}
              >
                {task.title}
              </label>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p role="status" className="mt-6 text-center text-sm text-zinc-400">
            No tasks found.
          </p>
        )}
      </main>
    </div>
  );
}
