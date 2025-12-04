"use client";

import { motion } from "framer-motion";
import { Calendar, User, Folder, Flag, Clock, CheckCircle2, Hourglass } from "lucide-react";

export default function TaskCard({ task }: any) {
  const getStatusBadge = () => {
    switch (task.status) {
      case "done":
        return {
          label: "Completed",
          icon: <CheckCircle2 size={14} />,
          styles: "bg-green-100 text-green-600 border-green-300"
        };
      case "progress":
        return {
          label: "In Progress",
          icon: <Hourglass size={14} />,
          styles: "bg-blue-100 text-blue-600 border-blue-300"
        };
      default:
        return {
          label: "Todo",
          icon: <Clock size={14} />,
          styles: "bg-amber-100 text-amber-600 border-amber-300"
        };
    }
  };

  const getPriorityBadge = () => {
    switch (task.priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-300";
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-300";
      default:
        return "text-orange-600 bg-orange-50 border-orange-300";
    }
  };

  const status = getStatusBadge();

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.2 }}
      className="p-5 rounded-xl shadow-[0_4px_10px_rgba(0,0,0,0.05)] bg-white border border-gray-100 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer group"
    >
      {/* Title & Status */}
      <div className="flex justify-between items-start gap-3">
        <h2 className="text-lg font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition">
          {task.name}
        </h2>

        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${status.styles}`}
        >
          {status.icon} {status.label}
        </span>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 mt-2 text-sm leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm text-gray-700">
        {task.user_details && (
          <div className="flex items-center gap-2">
            <User size={15} />
            <span className="font-medium">
              {task.user_details.first_name} {task.user_details.last_name}
            </span>
          </div>
        )}

        {task.project_details && (
          <div className="flex items-center gap-2">
            <Folder size={15} />
            <span>{task.project_details.name}</span>
          </div>
        )}

        {task.priority && (
          <div className={`flex items-center gap-2 px-2 py-1 border rounded-md text-xs font-semibold w-fit ${getPriorityBadge()}`}>
            <Flag size={13} /> {task.priority.toUpperCase()}
          </div>
        )}

        {task.due_date && (
          <div className="flex items-center gap-2">
            <Calendar size={15} />
            <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 flex justify-between text-xs text-gray-500">
        {task.created_at && (
          <span className="flex items-center gap-1">
            <Clock size={12} /> Created At: {new Date(task.created_at).toLocaleDateString()}
          </span>
        )}
        {task.updated_at && (
          <span className="italic">Updated At: {new Date(task.updated_at).toLocaleDateString()}</span>
        )}
      </div>
    </motion.div>
  );
}
