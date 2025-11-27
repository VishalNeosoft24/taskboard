// src/app/users/[id]/page.tsx
"use client";

import { useUsers } from "../../hooks/useUsers";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

export default function UserDetailPage() {
  const { id } = useParams();
  const { list } = useUsers();

  const user = list.data?.find((u: any) => u.id === Number(id));

  if (list.isLoading)
    return (
      <div className="p-10 animate-pulse max-w-3xl mx-auto">
        <div className="h-10 w-40 bg-gray-200 rounded mb-6"></div>
        <div className="h-40 w-full bg-gray-200 rounded-xl mb-6"></div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-xl"></div>
          ))}
        </div>
      </div>
    );

  if (!user) return <p className="p-6 text-red-500">User not found.</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* PAGE HEADER */}
      <h1 className="text-3xl font-bold mb-6">User Details</h1>

      {/* MAIN USER CARD */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border shadow-lg rounded-2xl p-8 flex flex-col sm:flex-row gap-8"
      >
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-28 h-28 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-semibold">
            {user.username?.[0]?.toUpperCase()}
          </div>
        </div>

        {/* User Info */}
        <div className="flex-1">
          <h2 className="text-2xl font-semibold text-gray-900">
            {user.username}
          </h2>
          <p className="text-gray-600">{user.email}</p>

          <div className="mt-4 flex gap-3 flex-wrap">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              Active User
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
              Date Of Joining: {user.date_of_joining}
            </span>
          </div>
        </div>
      </motion.div>

      {/* DETAILS SECTION */}
      <div className="mt-10 grid sm:grid-cols-2 gap-6">
        <DetailCard label="First Name" value={user.first_name} />
        <DetailCard label="Last Name" value={user.last_name} />
        <DetailCard label="Job Role" value={user.job_role} />
        <DetailCard label="Department" value={user.department} />
        <DetailCard label="Designation" value={user.designation} />
      </div>
    </div>
  );
}

/* --------------------- DETAIL CARD COMPONENT ---------------------- */
const DetailCard = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white border shadow rounded-xl p-5"
    >
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-900 font-medium mt-1">
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    </motion.div>
  );
};
