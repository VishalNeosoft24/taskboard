"use client";

import { useTasks } from "../hooks/useTasks";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";
import TaskCard from "./components/TaskCard";
import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, Filter, Search } from "lucide-react";

export default function TasksPage() {
  const { list: taskList, add } = useTasks();
  const { list: projectList } = useProjects();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState<number | "">("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const [search, setSearch] = useState("");

  if (taskList.isLoading || projectList.isLoading)
    return <p className="p-6">Loading...</p>;

  const handleAddTask = (e: any) => {
    e.preventDefault();

    if (!title || !description || projectId === "") {
      alert("Please fill all fields.");
      return;
    }

    add.mutate({
      name: title,
      description,
      project: Number(projectId),
      priority,
    });

    setTitle("");
    setDescription("");
    setProjectId("");
    setPriority("medium");
  };

  const filteredTasks = taskList.data?.filter((t: any) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">📝 Tasks</h1>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center bg-white border rounded-lg px-3 py-2 w-full shadow-sm">
          <Search size={18} className="text-gray-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks..."
            className="ml-2 outline-none w-full"
          />
        </div>

        <button className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg border hover:bg-gray-200 transition">
          <Filter size={18} />
          Filters
        </button>
      </div>

      {/* Add Task Form */}
      <motion.form
        onSubmit={handleAddTask}
        className="bg-white p-5 rounded-2xl shadow mb-8 border"
      >
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <PlusCircle /> Create New Task
        </h2>

        <div className="grid gap-3">
          <input
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
          />

          <textarea
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task description"
          />

          <select
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
          >
            <option value="">Select project</option>
            {projectList.data?.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <select
            className="border rounded-lg p-2 focus:ring focus:ring-blue-200"
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as "low" | "medium" | "high")
            }
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
            Add Task
          </button>
        </div>
      </motion.form>

      {/* Task List */}
      {filteredTasks?.length === 0 ? (
        <p className="text-center text-gray-500 mt-10">No tasks found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredTasks?.map((task: any) => (
            <Link key={task.id} href={`/tasks/${task.id}`}>
              <TaskCard task={task} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
