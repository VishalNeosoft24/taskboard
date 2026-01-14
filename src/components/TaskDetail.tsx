"use client";

import { Calendar, User, FolderKanban, Flag, Clock, Edit2, Check, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";


export default function TaskDetail({ task, onStatusChange, onPriorityChange, onUpdate }: any) {
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

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");

  const handleSave = () => {
    onUpdate({
      name,
      description,
    });
    setIsEditing(false);
  };

  const getColor = (options: any[], value: string) =>
    options.find((x) => x.value === value)?.color || "bg-gray-200 text-gray-900";

  const permissions = task?.project_details?.permissions || {};
  const canEdit = permissions.can_edit_task;

  return (
    <div className="mb-6 p-6 rounded-2xl shadow-lg border bg-gradient-to-br from-white via-gray-50 to-gray-100">
      {/* Title */}
      <div className="flex justify-between items-start gap-4">
        {isEditing ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full text-3xl font-bold border-b bg-transparent outline-none focus:border-blue-500"
            autoFocus
          />
        ) : (
          <h2 className="text-3xl font-bold text-gray-900">{task.name}</h2>
        )}

        {canEdit && !isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-gray-500 hover:text-blue-600"
          >
            <Edit2 size={18} />
          </button>
        )}
        { canEdit && isEditing && (
          <button
            onClick={() => {
              setIsEditing(false);
              setName(task.name);
              setDescription(task.description || "");
            }}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Description */}
      <div className="mt-4">
        {isEditing ? (
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full p-3 border rounded-xl outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Add task description..."
          />
        ) : (
          task.description && (
            <p className="text-gray-700 leading-relaxed">{task.description}</p>
          )
        )}
      </div>

      {/* Save / Cancel */}
      {isEditing && canEdit && (
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
          >
            <Check size={16} /> Save
          </button>

          {/* <button
            onClick={() => {
              setIsEditing(false);
              setName(task.name);
              setDescription(task.description || "");
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            <X size={16} /> Cancel
          </button> */}
        </div>
      )}

      {/* Status + Priority */}
      <div className="mt-5 flex gap-4 flex-wrap">
        {/* <select
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
        </select> */}

        <select
          value={task.status}
          disabled={!canEdit}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className={`px-4 py-2 text-sm font-semibold rounded-full
            ${getColor(statusOptions, task.status)}
            ${!canEdit && "opacity-60 cursor-not-allowed"}
          `}
        >
          {statusOptions.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      
          <select
            value={task.priority}
            disabled={!canEdit}
            onChange={(e) => onPriorityChange?.(e.target.value)}
            className={`px-4 py-2 text-sm font-semibold rounded-full
              ${getColor(priorityOptions, task.priority)}
              ${!canEdit && "opacity-60 cursor-not-allowed"}
            `}
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

        {/* {task.project_details && (
          <p className="flex items-center gap-2">
            <FolderKanban size={16} /> {task.project_details.name}
            <Link href={`/projects/${task.project_details.id}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full
               bg-gray-100 hover:bg-purple-100 text-sm text-gray-700
               hover:text-purple-700 transition" > view project details
            </Link>
          </p>
        )} */}
        {task.project_details && (
          <Link
            href={`/projects/${task.project_details.id}`}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition"
          >
            <FolderKanban size={16} />
            <span>{task.project_details.name}</span>
          </Link>
        )}
        <div className="flex items-center gap-4">
          <p className="flex items-center gap-2">
            <Clock size={16} /> Created: {new Date(task.created_at).toLocaleDateString()}
          </p>
          <p className="flex items-center gap-2">
            <Calendar size={16} /> Updated: {new Date(task.updated_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}
