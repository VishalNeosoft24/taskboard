// "use client";

// import { useTasks } from "./hooks/useTasks";
// import { useUsers } from "./hooks/useUsers";
// import { useProjects } from "./hooks/useProjects";
// import { motion } from "framer-motion";
// import Link from "next/link";
// import TaskCard from "./tasks/components/TaskCard";

// export default function DashboardPage() {
//   const { list: taskList } = useTasks();
//   const { list: projectList } = useProjects();
//   const { list: userList } = useUsers();

//   const loading = taskList.isLoading || projectList.isLoading;

//   if (loading)
//     return (
//       <div className="p-10 max-w-6xl mx-auto animate-pulse">
//         <div className="h-10 w-48 bg-gray-200 rounded mb-6"></div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
//           ))}
//         </div>

//         <div className="h-8 bg-gray-200 rounded w-40 mb-4"></div>

//         <div className="grid gap-4">
//           {[...Array(3)].map((_, i) => (
//             <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
//           ))}
//         </div>
//       </div>
//     );

//   // Status counter
//   const statusCount = {
//     todo: taskList.data?.filter((t: any) => t.status === "todo").length ?? 0,
//     inProgress:
//       taskList.data?.filter((t: any) => t.status === "progress").length ?? 0,
//     completed:
//       taskList.data?.filter((t: any) => t.status === "done").length ?? 0,
//   };

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

//       {/* STATS CARDS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <StatCard
//           title="Total Tasks"
//           value={taskList.data?.length || 0}
//           gradient="from-blue-500 to-purple-600"
//         />
//         <StatCard
//           title="Total Projects"
//           value={projectList.data?.length || 0}
//           gradient="from-green-500 to-emerald-600"
//         />
//         <StatCard
//           title="Total Users"
//           value={userList.data?.length || 0}
//           gradient="from-yellow-500 to-orange-500"
//         />
//       </div>

//       {/* TASK STATUS */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
//         <StatusCard label="To Do" count={statusCount.todo} color="red" />
//         <StatusCard
//           label="In Progress"
//           count={statusCount.inProgress}
//           color="orange"
//         />
//         <StatusCard
//           label="Completed"
//           count={statusCount.completed}
//           color="green"
//         />
//       </div>

//       {/* RECENT TASKS */}
//       <div className="mb-10">
//         <h2 className="text-2xl font-semibold mb-4">Recent Tasks</h2>

//         <div className="grid gap-4">
//           {taskList.data?.slice(0, 5).map((task: any) => (
//             <motion.div
//               key={task.id}
//               whileHover={{ scale: 1.01 }}
//               transition={{ type: "spring", stiffness: 300 }}
//             >
//               <Link href={`/tasks/${task.id}`}>
//                 <TaskCard task={task} />
//               </Link>
//             </motion.div>
//           ))}
//         </div>
//       </div>

//       {/* QUICK ACTIONS */}
//       <div className="flex flex-wrap gap-4 mt-6">
//         <ActionButton href="/tasks" label="View All Tasks" color="blue" />
//         <ActionButton href="/projects" label="View Projects" color="green" />
//         <ActionButton href="/users" label="View Users" color="yellow" />
//       </div>
//     </div>
//   );
// }

// /* ------------------------------------------------------------
//    COMPONENTS
// ------------------------------------------------------------- */

// const StatCard = ({
//   title,
//   value,
//   gradient,
// }: {
//   title: string;
//   value: any;
//   gradient: string;
// }) => (
//   <motion.div
//     initial={{ opacity: 0, y: 10 }}
//     animate={{ opacity: 1, y: 0 }}
//     className={`p-6 rounded-2xl shadow-lg text-white bg-gradient-to-r ${gradient}`}
//   >
//     <h2 className="text-lg font-medium">{title}</h2>
//     <p className="text-4xl font-bold mt-2">{value}</p>
//   </motion.div>
// );

// const StatusCard = ({
//   label,
//   count,
//   color,
// }: {
//   label: string;
//   count: number;
//   color: string;
// }) => (
//   <motion.div
//     whileHover={{ scale: 1.03 }}
//     className={`p-6 rounded-2xl shadow border-l-4 border-${color}-500 bg-white`}
//   >
//     <h3 className="text-xl font-semibold">{label}</h3>
//     <p className="text-3xl font-bold mt-2">{count}</p>
//   </motion.div>
// );

// const ActionButton = ({
//   href,
//   label,
//   color,
// }: {
//   href: string;
//   label: string;
//   color: string;
// }) => (
//   <Link
//     href={href}
//     className={`px-5 py-3 rounded-xl font-semibold bg-${color}-600 text-white hover:bg-${color}-700 transition`}
//   >
//     {label}
//   </Link>
// );








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

export default function DashboardPage() {
  const { list: taskList } = useTasks();
  const { list: projectList } = useProjects();
    const { list: userList } = useUsers();


  if (taskList.isLoading || projectList.isLoading)
    return <p className="p-6">Loading dashboard...</p>;

  const tasks = taskList.data || [];
  const projects = projectList.data || [];

  // STATUS DATA
  const statusCount = {
    todo: tasks.filter((t: any) => t.status === "todo").length,
    inProgress: tasks.filter((t: any) => t.status === "progress").length,
    completed: tasks.filter((t: any) => t.status === "done").length,
  };

  const pieData = [
    { name: "To Do", value: statusCount.todo },
    { name: "In Progress", value: statusCount.inProgress },
    { name: "Completed", value: statusCount.completed },
  ];

  const COLORS = ["#ef4444", "#f97316", "#22c55e"];

  // Weekly Trend Dummy Data (Replace later with API)
  const weeklyData = [
    { name: "Mon", tasks: 8 },
    { name: "Tue", tasks: 12 },
    { name: "Wed", tasks: 4 },
    { name: "Thu", tasks: 10 },
    { name: "Fri", tasks: 7 },
    { name: "Sat", tasks: 5 },
    { name: "Sun", tasks: 2 },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      
      {/* TITLE */}
      <h1 className="text-4xl font-bold mb-6">📊 Dashboard Analytics</h1>

      {/* PREMIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "Total Tasks", value: tasks.length },
          { title: "Total Projects", value: projects.length },
          { title: "Completed Tasks", value: statusCount.completed },
          { title: "Active Users", value: userList.data?.length }
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
