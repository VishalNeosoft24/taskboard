// src/app/profile/page.tsx
"use client";

import { useCurrentUser } from "../hooks/useCurrentUser";
import { useState, useEffect } from "react";
import { LogOut, User } from "lucide-react";

export default function UserProfilePage() {
  const { user, update } = useCurrentUser();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    department: "",
    designation: "",
    job_role: "", // ⭐ Not editable
    date_of_joining: "",
  });

  useEffect(() => {
    if (user.data) {
      setFormData({
        username: user.data.username || "",
        first_name: user.data.first_name || "",
        last_name: user.data.last_name || "",
        email: user.data.email || "",
        job_role: user.data.job_role || "",          // Read-only
        department: user.data.department || "",
        designation: user.data.designation || "",
        date_of_joining: user.data.date_of_joining || "",
      });
    }
  }, [user.data]);

  if (user.isLoading) return <p className="p-6">Loading user...</p>;
  if (user.isError) return <p className="p-6 text-red-500">Failed to load user.</p>;

  const handleUpdate = (e: any) => {
    e.preventDefault();

    const updated = { ...formData };
    delete updated.job_role; // ❌ REMOVE job_role before update — not allowed
    delete update.username;

    update.mutate(updated, {
      onSuccess: () => alert("Profile updated successfully!"),
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/login";
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-semibold shadow-lg">
            {formData.username?.charAt(0)?.toUpperCase()}
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Profile</h1>
            <p className="text-gray-500 mt-1">
              Manage your personal information and account settings
            </p>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">Date of Joining: {formData.date_of_joining}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 flex items-center gap-2 border border-red-400 text-red-600 rounded-lg hover:bg-red-50 shadow-sm transition"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Profile Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border p-8">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Personal Information
        </h2>

        <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Non Editable Role */}
          <div className="flex flex-col opacity-80 cursor-not-allowed">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Username
            </label>
            <input
              value={formData.username}
              readOnly
              disabled
              className="border rounded-lg px-4 py-2.5 bg-gray-100 text-gray-500 shadow-inner"
            />
          </div>

          {/* Editable Fields */}
          {["first_name", "last_name", "email", "department", "designation"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="text-sm font-medium text-gray-600 mb-1 capitalize">
                {field.replace("_", " ")}
              </label>

              <input
                value={(formData as any)[field]}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, [field]: e.target.value }))
                }
                className="border rounded-lg px-4 py-2.5 text-gray-800 shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              />
            </div>
          ))}

          {/* Non Editable Role */}
          <div className="flex flex-col opacity-80 cursor-not-allowed">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Job Role (Not editable)
            </label>
            <input
              value={formData.job_role}
              readOnly
              disabled
              className="border rounded-lg px-4 py-2.5 bg-gray-100 text-gray-500 shadow-inner"
            />
          </div>

          {/* Update Button */}
          <div className="col-span-full flex justify-end mt-4">
            <button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl text-lg shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
