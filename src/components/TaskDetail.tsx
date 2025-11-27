// src/components/TaskDetail.tsx
"use client";

export default function TaskDetail({
  task,
  onStatusChange,
  onPriorityChange,
}: {
  task: any;
  onStatusChange?: (status: string) => void;
  onPriorityChange?: (priority: string) => void;
}) {
  const statusColors: Record<string, string> = {
    todo: "bg-gray-200 text-gray-800",
    in_progress: "bg-yellow-200 text-yellow-800",
    done: "bg-green-200 text-green-800",
    blocked: "bg-red-200 text-red-800",
  };

  const priorityColors: Record<string, string> = {
    low: "bg-blue-200 text-blue-800",
    medium: "bg-yellow-200 text-yellow-800",
    high: "bg-red-200 text-red-800",
  };

  return (
    <div className="p-6 border rounded-lg shadow-md bg-white mb-6">
      <h2 className="text-2xl font-bold text-gray-900">{task.name}</h2>
      <p className="text-gray-700 mt-3">{task.description}</p>

      <div className="flex flex-wrap gap-2 mt-4 items-center">
        {/* Status dropdown */}
        <select
          value={task.status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${statusColors[task.status] || "bg-gray-200 text-gray-800"}`}
        >
          <option value="todo">TODO</option>
          <option value="progress">IN PROGRESS</option>
          <option value="done">DONE</option>
        </select>

        {/* Priority dropdown */}
        <select
          value={task.priority}
          onChange={(e) => onPriorityChange?.(e.target.value)}
          className={`px-3 py-1 rounded-full text-sm font-semibold ${priorityColors[task.priority] || "bg-gray-200 text-gray-800"}`}
        >
          <option value="low">LOW</option>
          <option value="medium">MEDIUM</option>
          <option value="high">HIGH</option>
        </select>
      </div>

      <div className="mt-4 text-sm text-gray-500 space-y-1">
        {task.user_details && (
          <p>
            Assigned to: <span className="font-medium">{task.user_details.username}</span> ({task.user_details.email})
          </p>
        )}
        {task.project_details && (
          <p>
            Project: <span className="font-medium">{task.project_details.name}</span>
          </p>
        )}
        <p>Created: {new Date(task.created_at).toLocaleString()}</p>
        <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
        {task.due_date && <p>Due: {new Date(task.due_date).toLocaleString()}</p>}
      </div>
    </div>
  );
}
