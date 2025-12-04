// // src/app/projects/page.tsx
// "use client";

// import Link from "next/link";
// import { useProjects } from "../hooks/useProjects";
// import { useState } from "react";
// import { Plus, Folder, FolderOpen } from "lucide-react";

// export default function ProjectsPage() {
//   const { list, add, deleteProject } = useProjects();
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");

//   if (list.isLoading)
//     return <p className="p-8 text-xl text-gray-600">Loading projects...</p>;

//   const handleAddProject = (e: any) => {
//     e.preventDefault();
//     if (!name.trim()) return;

//     add.mutate({ name, description });
//     setName("");
//     setDescription("");
//   };

//   return (
//     <div className="p-8 max-w-6xl mx-auto">

//       {/* Page Header */}
//       <div className="flex justify-between items-center mb-10">
//         <div>
//           <h1 className="text-4xl font-bold text-gray-800 tracking-tight">
//             Projects
//           </h1>
//           <p className="text-gray-500 mt-1">
//             Manage your active, upcoming and archived projects
//           </p>
//         </div>
//       </div>


//       {/* Add Project Form */}
//       <form
//         onSubmit={handleAddProject}
//         className="bg-white/70 backdrop-blur-xl border shadow-lg rounded-2xl p-6 mb-10 grid gap-4"
//       >
//         <h2 className="text-lg font-semibold text-gray-700">Create New Project</h2>

//         {/* Floating Inputs */}
//         <div className="relative">
//           <input
//             type="text"
//             value={name}
//             required
//             onChange={(e) => setName(e.target.value)}
//             className="peer w-full px-4 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition bg-white"
//           />
//           <label className="absolute left-4 top-3 text-gray-500 transition-all peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600 peer-valid:-top-2 peer-valid:text-xs">
//             Project Name
//           </label>
//         </div>

//         <div className="relative">
//             <textarea
//                 placeholder=" "
//                 rows={4}
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//                 className="peer w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-400 outline-none"
//             />
//             <label className="
//                 absolute left-4 top-3 text-gray-500 transition-all
//                 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
//                 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-blue-600
//                 peer-[&:not(:placeholder-shown)]:-top-2
//                 peer-[&:not(:placeholder-shown)]:text-xs
//             ">
//                 Description (optional)
//             </label>
//         </div>

//         <button
//           type="submit"
//           className="w-full md:w-max px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:opacity-90 transition flex items-center gap-2"
//         >
//           <Plus size={18} /> Create Project
//         </button>
//       </form>

//       {/* Project List */}
//       {list.data?.length === 0 ? (
//         <div className="text-center py-20 text-gray-400 text-lg">
//           No projects found. Create your first project!
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {list.data.map((project: any) => (
//             <Link
//               href={`/projects/${project.id}`}
//               key={project.id}
//               className="group p-6 bg-white border rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition cursor-pointer"
//             >
//               <div className="flex items-center gap-3">
//                 <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg">
//                   <FolderOpen size={22} />
//                 </div>
//                 <h2 className="text-xl font-semibold text-gray-800 group-hover:text-blue-600 transition">
//                   {project.name}
//                 </h2>
//               </div>

//               {project.description && (
//                 <p className="text-gray-600 mt-3 line-clamp-3">
//                   {project.description}
//                 </p>
//               )}

//               <div className="mt-4 text-sm text-gray-400">
//                 Role: {project.user_role}
//               </div>
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import Link from "next/link";
import { useProjects } from "../hooks/useProjects";
import { useState } from "react";
import { Plus, FolderOpen, Search } from "lucide-react";

export default function ProjectsPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ search: "" });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { list, add } = useProjects(page, filters);

  const handleAddProject = (e: any) => {
    e.preventDefault();
    if (!name.trim()) return;
    add.mutate({ name, description });
    setName(""); setDescription("");
  };
  
  const results = list.data?.results.projects || [];
  const totalPages = list.data?.results?.total_pages || 1;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your projects</p>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search Projects..."
            value={filters.search}
            onChange={(e) => {
              setPage(1);
              setFilters({ ...filters, search: e.target.value });
            }}
            className="pl-10 pr-4 py-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>

      {/* Add Project */}
      <form
        onSubmit={handleAddProject}
        className="bg-white border shadow-lg rounded-2xl p-6 mb-10 grid gap-4"
      >
        <h2 className="text-lg font-semibold">Create New Project</h2>

        <input
          type="text"
          placeholder="Project Name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="px-4 py-3 border rounded-lg shadow-sm"
        />

        <textarea
          rows={4}
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-4 py-3 border rounded-lg shadow-sm"
        />

        <button
          type="submit"
          className="w-full md:w-max px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg flex items-center gap-2"
        >
          <Plus size={18} /> Create Project
        </button>
      </form>

      {/* Project Listing */}
      {results.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No Projects Found</p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((project: any) => (
              <Link
                key={project.id}
                href={`/projects/${project.id}`}
                className="group p-6 bg-white border rounded-2xl shadow-md hover:shadow-xl transition"
              >
                <div className="flex gap-3 items-center">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <FolderOpen size={22} />
                  </div>
                  <h2 className="text-xl font-semibold group-hover:text-blue-600 transition">
                    {project.name}
                  </h2>
                </div>

                {project.description && (
                  <p className="text-gray-600 mt-3 line-clamp-3">
                    {project.description}
                  </p>
                )}

                <p className="mt-4 text-sm text-gray-400">
                  Role: {project.user_role || "N/A"}
                </p>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-4 mt-10">
            <button
              disabled={!list.data?.previous}
              onClick={() => setPage(page - 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-40"
            >
              Prev
            </button>
            <span className="font-semibold text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={!list.data?.next}
              onClick={() => setPage(page + 1)}
              className="px-4 py-2 rounded-lg border disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
