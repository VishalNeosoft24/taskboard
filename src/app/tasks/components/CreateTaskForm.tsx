"use client";

import { motion } from "framer-motion";

interface CreateTaskFormProps {
  title: string;
  description: string;
  priority: string;

  projectId: string;
  projectName: string; // 👈 pass current project name

  setTitle: (v: string) => void;
  setDescription: (v: string) => void;
  setPriority: (v: string) => void;

  onSubmit: (e: any) => void;
}

export default function CreateTaskForm({
  title,
  description,
  priority,
  projectId,
  projectName,
  setTitle,
  setDescription,
  setPriority,
  onSubmit,
}: CreateTaskFormProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-4">Create New Task</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Task Title */}
        <input
          className="border rounded-xl p-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          required
        />

        {/* Project (Read Only) */}
        <div className="border rounded-xl p-3 bg-gray-100 text-gray-700 cursor-not-allowed">
          📁 {projectName}
        </div>

        {/* Hidden projectId (submitted automatically) */}
        <input type="hidden" value={projectId} />

        {/* Description */}
        <textarea
          className="border rounded-xl p-3 md:col-span-2"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Task description"
        />

        {/* Priority */}
        <select
          className="border rounded-xl p-3"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-3 font-medium md:col-span-2"
        >
          ➕ Add Task
        </button>
      </div>
    </motion.form>
  );
}
