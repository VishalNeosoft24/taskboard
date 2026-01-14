"use client";

import { motion } from "framer-motion";
import SearchableProjectSelect from "./SearchableProjectSelect";

type TaskFormProps = {
  title: string;
  description: string;
  priority: string;
  projectId: string;

  projectSearchText: string;
  projects?: any[];

  onTitleChange: (val: string) => void;
  onDescriptionChange: (val: string) => void;
  onPriorityChange: (val: string) => void;
  onProjectChange: (val: string) => void;
  onProjectSearchChange: (val: string) => void;

  onSubmit: (e: React.FormEvent) => void;

  submitLabel?: string;
  heading?: string;
  loading?: boolean;
};

export default function TaskForm({
  title,
  description,
  priority,
  projectId,
  projectSearchText,
  projects = [],

  onTitleChange,
  onDescriptionChange,
  onPriorityChange,
  onProjectChange,
  onProjectSearchChange,

  onSubmit,

  submitLabel = "➕ Add Task",
  heading = "Create New Task",
  loading = false,
}: TaskFormProps) {
  return (
    <motion.form
      onSubmit={onSubmit}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 mb-10"
    >
      <h2 className="text-xl font-semibold mb-4">{heading}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <input
          className="border rounded-xl p-3"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Task title"
          disabled={loading}
        />

        {/* Project */}
        <SearchableProjectSelect
          value={projectId}
          searchText={projectSearchText}
          onSearchTextChange={onProjectSearchChange}
          onChange={onProjectChange}
          defaultProjects={projects}
          disabled={loading}
        />

        {/* Description */}
        <textarea
          className="border rounded-xl p-3 md:col-span-2"
          rows={3}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Task description"
          disabled={loading}
        />

        {/* Priority */}
        <select
          className="border rounded-xl p-3"
          value={priority}
          onChange={(e) => onPriorityChange(e.target.value)}
          disabled={loading}
        >
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl px-5 py-3 font-medium md:col-span-2"
        >
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </motion.form>
  );
}
