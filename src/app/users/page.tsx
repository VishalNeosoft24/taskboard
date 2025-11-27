// src/app/users/page.tsx
"use client";

import { useState } from "react";
import { useUsers } from "../hooks/useUsers";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UsersPage() {
  const { list } = useUsers();
  const [search, setSearch] = useState("");

  if (list.isLoading) return <p className="p-6">Loading users...</p>;

  const filteredUsers =
    list.data?.filter((u: any) =>
      u.username.toLowerCase().includes(search.toLowerCase())
    ) || [];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold">Users</h1>
      </div>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="w-full px-4 py-3 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-500 text-center py-10">No users found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
          {filteredUsers.map((user: any) => (
            <Link key={user.id} href={`/users/${user.id}`}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-4"
              >
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xl font-semibold">
                  {user.username ? user.username[0].toUpperCase() : "U"}
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {user.username}
                  </h2>
                  <p className="text-gray-600 text-sm">{user.email}</p>
                  <p className="text-gray-600 text-sm">{user.job_role}</p>
                </div>

                {/* Status Badge */}
                <span
                  className="self-start px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium"
                >
                  Active
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}








// with pagination


// "use client";

// import { useState, useEffect, useRef, useCallback } from "react";
// import Link from "next/link";
// import { motion } from "framer-motion";

// export default function UsersPage() {
//   const [users, setUsers] = useState<any[]>([]);
//   const [page, setPage] = useState(1);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);

//   const observer = useRef<IntersectionObserver | null>(null);
//   const lastUserRef = useCallback(
//     (node: any) => {
//       if (loading) return;

//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prev) => prev + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore]
//   );

//   // Fetch Users
//   useEffect(() => {
//     const loadUsers = async () => {
//       setLoading(true);

//       const res = await fetch(`/api/users?page=${page}`);
//       const data = await res.json();

//       setUsers((prev) => [...prev, ...data.results]);
//       setHasMore(data.next !== null);
//       setLoading(false);
//     };

//     loadUsers();
//   }, [page]);

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h1 className="text-4xl font-bold mb-6">Users</h1>

//       <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
//         {users.map((user, index) =>
//           index === users.length - 1 ? (
//             <Link ref={lastUserRef} key={user.id} href={`/users/${user.id}`}>
//               <UserCard user={user} />
//             </Link>
//           ) : (
//             <Link key={user.id} href={`/users/${user.id}`}>
//               <UserCard user={user} />
//             </Link>
//           )
//         )}

//         {loading && <SkeletonLoader />}
//       </div>
//     </div>
//   );
// }

// /* -------------------- USER CARD COMPONENT -------------------- */
// const UserCard = ({ user }: { user: any }) => {
//   return (
//     <motion.div
//       whileHover={{ scale: 1.03 }}
//       transition={{ type: "spring", stiffness: 200 }}
//       className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-4"
//     >
//       <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xl font-semibold">
//         {user.username?.[0]?.toUpperCase()}
//       </div>

//       <div>
//         <h2 className="text-lg font-semibold text-gray-900">
//           {user.username}
//         </h2>
//         <p className="text-gray-600 text-sm">{user.email}</p>
//       </div>

//       <span className="self-start px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
//         Active
//       </span>
//     </motion.div>
//   );
// };

// /* -------------------- SKELETON LOADER COMPONENT -------------------- */
// const SkeletonLoader = () => {
//   return (
//     <>
//       {Array.from({ length: 6 }).map((_, i) => (
//         <div
//           key={i}
//           className="animate-pulse bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-4"
//         >
//           <div className="w-14 h-14 rounded-full bg-gray-200"></div>
//           <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
//           <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
//           <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
//         </div>
//       ))}
//     </>
//   );
// };
