"use client";

import { Calendar, User, FolderKanban, Flag, Clock } from "lucide-react";

export default function TaskDetail({ task, onStatusChange, onPriorityChange }: any) {
  const statusOptions = [
    { value: "todo", label: "To Do", color: "bg-gray-200 text-gray-900" },
    { value: "progress", label: "In Progress", color: "bg-blue-200 text-blue-900" },
    { value: "done", label: "Done", color: "bg-green-200 text-green-900" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low", color: "bg-green-200 text-green-900" },
    { value: "medium", label: "Medium", color: "bg-yellow-200 text-yellow-900" },
    { value: "high", label: "High", color: "bg-red-200 text-red-900" },
  ];

  const getColor = (options: any[], value: string) =>
    options.find((x) => x.value === value)?.color || "bg-gray-200 text-gray-900";

  return (
    <div className="mb-6 p-6 rounded-2xl shadow-lg border bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 drop-shadow-sm">{task.name}</h2>

      {/* Description */}
      {task.description && (
        <p className="mt-3 text-gray-700 leading-relaxed">{task.description}</p>
      )}

      {/* Status + Priority */}
      <div className="mt-5 flex gap-4 flex-wrap">
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-full ${getColor(
            statusOptions,
            task.status
          )}`}
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <select
          value={task.priority}
          onChange={(e) => onPriorityChange?.(e.target.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-full ${getColor(
            priorityOptions,
            task.priority
          )}`}
        >
          {priorityOptions.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 text-sm space-y-2 text-gray-600">
        {task.user_details && (
          <p className="flex items-center gap-2">
            <User size={16} /> {task.user_details.username}
          </p>
        )}

        {task.project_details && (
          <p className="flex items-center gap-2">
            <FolderKanban size={16} /> {task.project_details.name}
          </p>
        )}

        <p className="flex items-center gap-2">
          <Clock size={16} /> Created: {new Date(task.created_at).toLocaleDateString()}
        </p>

        <p className="flex items-center gap-2">
          <Calendar size={16} /> Updated: {new Date(task.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
