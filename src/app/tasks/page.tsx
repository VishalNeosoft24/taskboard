"use client";

import { useState } from "react";
import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import TaskCard from "./components/TaskCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, PlusCircle, ChevronLeft, ChevronRight, FilterX } from "lucide-react";
import { useDebounce } from "../hooks/useDebounce";

export default function TasksPage() {
  const [page, setPage] = useState(1);

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    project: "",
  });

  const debouncedFilters = useDebounce(filters, 400);

  const { list: taskList, add } = useTasks(page, debouncedFilters);
  const { list: projectList } = useProjects();

  // Create Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [projectId, setProjectId] = useState("");

  const handleAddTask = async (e: any) => {
    e.preventDefault();

    if (!title.trim()) return alert("Task title required");

    await add.mutateAsync({
      name: title,
      description,
      priority,
      project: projectId || null,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setPriority("low");
    setProjectId("");

    // Refresh list
    setPage(1);
  };

  if (taskList.isLoading || projectList.isLoading)
    return <p className="p-6 text-lg font-medium text-gray-600">Loading...</p>;

  const data = taskList.data;
  const tasks = data?.results?.tasks || [];
  const currentPage = data?.results?.current_page || 1;
  const totalPages = data?.results?.total_pages || 1;

  const resetFilters = () => {
    setFilters({ search: "", status: "", priority: "", project: "" });
    setPage(1);
  };

  const setFilterAndReset = (patch: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
    setPage(1);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">📝 Tasks</h1>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-5 rounded-2xl shadow-md border space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">

          <div className="flex items-center bg-gray-100 rounded-xl px-3 py-2 col-span-2 shadow-sm">
            <Search size={18} className="text-gray-500" />
            <input
              value={filters.search}
              onChange={(e) => setFilterAndReset({ search: e.target.value })}
              placeholder="Search tasks..."
              className="ml-2 bg-transparent outline-none w-full"
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilterAndReset({ status: e.target.value })}
            className="rounded-xl bg-gray-100 p-2 shadow-sm"
          >
            <option value="">Status</option>
            <option value="todo">To Do</option>
            <option value="progress">In Progress</option>
            <option value="done">Done</option>
          </select>

          <select
            value={filters.priority}
            onChange={(e) => setFilterAndReset({ priority: e.target.value })}
            className="rounded-xl bg-gray-100 p-2 shadow-sm"
          >
            <option value="">Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <select
            value={filters.project}
            onChange={(e) => setFilterAndReset({ project: e.target.value })}
            className="rounded-xl bg-gray-100 p-2 shadow-sm col-span-2"
          >
            <option value="">Project</option>
            {projectList.data.results.projects?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        {(filters.search || filters.status || filters.priority || filters.project) && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 text-sm text-red-600 hover:text-red-700"
          >
            <FilterX size={16} /> Clear Filters
          </button>
        )}
      </motion.div>

      {/* Create Task Form */}
      <motion.form
        onSubmit={handleAddTask}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-10"
        id="create-task"
      >
        <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            className="border rounded-xl p-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <select
            className="border rounded-xl p-3"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select project</option>
            {projectList.data.results.projects?.map((p: any) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <textarea
            className="border rounded-xl p-3 md:col-span-2"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />

          <select
            className="border rounded-xl p-3"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-medium md:col-span-2"
          >
            ➕ Add Task
          </button>
        </div>
      </motion.form>

      {/* Tasks List */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <p className="text-gray-500 text-center text-lg">No tasks found ✨</p>
        ) : (
          tasks.map((task: any) => (
            <motion.div key={task.id} whileHover={{ scale: 1.01 }}>
              <Link href={`/tasks/${task.id}`}>
                <TaskCard task={task} />
              </Link>
            </motion.div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setPage(currentPage - 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
        >
          <ChevronLeft size={18} /> Prev
        </button>

        <span className="font-medium">Page {currentPage} / {totalPages}</span>

        <button
          disabled={currentPage === totalPages}
          onClick={() => setPage(currentPage + 1)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 disabled:opacity-30"
        >
          Next <ChevronRight size={18} />
        </button>
      </div>

      {/* Floating Button */}
      <Link href="#create-task">
        <motion.button
          whileHover={{ scale: 1.07 }}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 shadow-xl flex items-center justify-center"
        >
          <PlusCircle size={26} className="text-white" />
        </motion.button>
      </Link>
    </div>
  );
}
