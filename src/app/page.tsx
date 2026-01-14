"use client";

import { useTasks } from "../app/hooks/useTasks";
import { useProjects } from "../app/hooks/useProjects";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUsers } from "./hooks/useUsers";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";
import { useState } from "react";
import { useTaskStatusAnalytics, useWeeklyAnalytics } from "./hooks/useTaskAnalytics";



export default function DashboardPage() {
  const [page, setPage] = useState(1);
  const { list: taskList } = useTasks(page, {});
  const { list: projectList } = useProjects(page, {});
  const { list: userList } = useUsers(page, "");

  const { data: pieData = [], isLoading: loadingStatus } = useTaskStatusAnalytics();
  const { data: weeklyData = [], isLoading: loadingWeekly } = useWeeklyAnalytics();

  console.log("pieData", { pieData });

  if (taskList.isLoading || projectList.isLoading)
    return <p className="p-6">Loading dashboard...</p>;

  const tasks = taskList.data.results.tasks || [];

  const COLORS = ["#ef4444", "#f97316", "#22c55e"];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-6">📊 Dashboard Analytics</h1>

      {/* PREMIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Tasks", value: taskList.data.count },
          { title: "Total Projects", value: projectList.data.count },
          { title: "Completed Tasks", value: pieData.filter((s: any) => s.name === "Completed")[0]?.value || 0 },
          { title: "Active Users", value: userList.data?.results?.length }
        ].map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border rounded-2xl shadow hover:shadow-lg transition"
          >
            <h2 className="text-gray-500">{card.title}</h2>
            <p className="text-3xl font-bold mt-2">{card.value}</p>
          </motion.div>
        ))}
      </div>

      {/* CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* TASK DISTRIBUTION PIE CHART */}
        <div className="bg-white border rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Task Distribution</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* WEEKLY BAR CHART */}
        <div className="bg-white border rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Tasks Created (Weekly)</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* PROJECT ACTIVITY LINE CHART */}
        <div className="bg-white border rounded-2xl p-6 shadow">
          <h2 className="font-semibold mb-4">Project Activity</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={weeklyData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line dataKey="tasks" stroke="#6366f1" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* LATEST ACTIVITY */}
      <div className="bg-white border rounded-2xl p-6 shadow mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Updates</h2>

        {tasks.slice(0, 5).map((task: any) => (
          <Link
            key={task.id}
            href={`/tasks/${task.id}`}
            className="block p-3 border-b hover:bg-gray-50"
          >
            <p className="font-medium">{task.name}</p>
            <p className="text-sm text-gray-500">{task.status}</p>
          </Link>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="flex gap-4">
        <Link
          href="/tasks"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow"
        >
          View All Tasks
        </Link>
        <Link
          href="/projects"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 shadow"
        >
          View Projects
        </Link>
        <Link
          href="/users"
          className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 shadow"
        >
          View Users
        </Link>
      </div>
    </div>
  );
}
