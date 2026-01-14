"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "Tasks", path: "/tasks" },
    { name: "Projects", path: "/projects" },
    { name: "Users", path: "/users" },
    { name: "Profile", path: "/profile" },
  ];

  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex justify-between items-center">
      {/* Logo */}
      <div className="text-2xl font-bold text-blue-600 tracking-wide">
        TaskBoard
      </div>

      {/* Menu */}
      <div className="flex gap-6">
        {navItems.map((item) => (
          <Link
            key={item.path}
            href={item.path}
            className={`px-3 py-1 text-[15px] font-medium rounded-md transition-all 
              ${
                pathname === item.path
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-600 hover:text-blue-600"
              }`}
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          window.location.href = "/login";
        }}
        className="p-2 rounded-md hover:bg-red-50 transition group"
        title="Logout"
      >
        <LogOut
          size={22}
          className="text-gray-600 group-hover:text-red-500 transition"
        />
      </button>
    </nav>
  );
}
