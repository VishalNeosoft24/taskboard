// src/app/users/page.tsx
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useUsers } from "../hooks/useUsers";
import { useDebounce } from "../hooks/useDebounce";

interface User {
  id: number;
  username: string;
  email: string;
  date_of_joining: string;
}

export default function UsersPage(): JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedSearch = useDebounce(search, 400);
  const { list: userList } = useUsers(page, debouncedSearch);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastUserRef = useCallback(
    (node: HTMLAnchorElement | null) => {
      if (userList.isLoading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && userList.data?.next) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [userList.isLoading, userList.data?.next]
  );

  /* 🔁 Reset on search */
  useEffect(() => {
    setPage(1);
    setUsers([]);
  }, [debouncedSearch]);

  /* 📥 Fetch users */
  useEffect(() => {
    if (!userList.data) return;

    setUsers((prev) =>
      page === 1
        ? userList.data.results
        : [...prev, ...userList.data.results]
    );
  }, [userList.data, page]);

  /* 🎯 Keep focus after refetch */
  useEffect(() => {
    inputRef.current?.focus();
  }, [userList.isFetching]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Users</h1>

      {/* SEARCH INPUT (never unmounts) */}
      <input
        ref={inputRef}
        type="text"
        placeholder="Search users..."
        className="w-full px-4 py-3 rounded-xl border mb-6"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Initial Loading */}
      {userList.isLoading && page === 1 && (
        <>
          <p className="text-center text-gray-500 mb-6">
            Loading users...
          </p>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            <SkeletonLoader />
            </div>
        </>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {!userList.isLoading && users.length === 0 && (
          <p className="col-span-full text-center text-xl font-semibold text-gray-500">
            No users found.
          </p>
        )}

        {users.map((user, index) => {
          const isLast = index === users.length - 1;
                    
          return (
            <Link
              ref={isLast ? lastUserRef : null}
              key={user.id}
              href={`/users/${user.id}`}
              prefetch={false}
            >
              <UserCard user={user} />
            </Link>
          );
        })}

        {userList.isLoading && page > 1 && <SkeletonLoader />}
      </div>
    </div>
  );
}



/* -------------------- USER CARD COMPONENT -------------------- */
const UserCard = ({ user }: { user: any }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md cursor-pointer transition flex flex-col gap-4"
    >
      <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white flex items-center justify-center text-xl font-semibold">
        {user.username?.[0]?.toUpperCase()}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          {user.username}
        </h2>
        <p className="text-gray-600 text-sm">{user.email}</p>
        <p className="text-gray-600 text-sm"><b>Department:</b> {user.department}</p>
      </div>

      <span className="self-start px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
        Active
      </span>
    </motion.div>
  );
};

/* -------------------- SKELETON LOADER COMPONENT -------------------- */
const SkeletonLoader = () => {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-white p-5 rounded-2xl border shadow-sm flex flex-col gap-4"
        >
          <div className="w-14 h-14 rounded-full bg-gray-200"></div>
          <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
          <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          <div className="h-5 w-20 bg-gray-200 rounded-full"></div>
        </div>
      ))}
    </>
  );
};
