"use client";

import { motion } from "framer-motion";
import { Calendar, User, Folder, Flag, Clock } from "lucide-react";

interface TaskCardProps {
  task: {
    id: number;
    name: string;
    description?: string;
    status: string;
    priority?: string;
    created_at?: string;
    updated_at?: string;
    due_date?: string | null;
    user_details?: {
      username: string;
      first_name: string;
      last_name: string;
    };
    project_details?: {
      name: string;
    } | null;
  };
}

export default function TaskCard({ task }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border border-green-500/20";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 border border-blue-500/20";
      default:
        return "bg-yellow-500/10 text-yellow-600 border border-yellow-500/20";
    }
  };

  const getPriorityColor = (priority: string | undefined) => {
    switch (priority) {
      case "high":
        return "text-red-600";
      case "low":
        return "text-green-600";
      default:
        return "text-orange-600";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="p-5 rounded-2xl shadow-md bg-white border border-gray-200 hover:shadow-xl transition cursor-pointer"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{task.name}</h2>
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {task.status.replace("-", " ").toUpperCase()}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 mt-2 leading-relaxed">{task.description}</p>
      )}

      {/* Details */}
      <div className="mt-3 space-y-1 text-sm">
        {task.user_details && (
          <div className="flex items-center gap-2 text-gray-700">
            <User size={14} />
            <span>
              {task.user_details.first_name} {task.user_details.last_name} (
              {task.user_details.username})
            </span>
          </div>
        )}

        {task.project_details && (
          <div className="flex items-center gap-2 text-gray-700">
            <Folder size={14} />
            <span>{task.project_details.name}</span>
          </div>
        )}

        {task.priority && (
          <div className="flex items-center gap-2 font-semibold">
            <Flag size={14} />
            <span className={getPriorityColor(task.priority)}>
              Priority: {task.priority}
            </span>
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar size={14} />
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 text-xs text-gray-400 flex items-center gap-4">
        {task.created_at && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Created: {new Date(task.created_at).toLocaleString()}
          </span>
        )}

        {task.updated_at && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            Updated: {new Date(task.updated_at).toLocaleString()}
          </span>
        )}
      </div>
    </motion.div>
  );
}
