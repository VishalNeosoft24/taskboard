"use client";

import { FC, useMemo, useState, useEffect } from "react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (members: { userId: number; role: string }[]) => void;
  users: any[];
}

const ROLES = ["owner", "admin", "member", "viewer"];

const AddMemberModal: FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  users,
}) => {
  const [search, setSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<
    { id: number; username: string; email: string; role: string }[]
  >([]);

  useEffect(() => {
    if (isOpen) {
        setSelectedMembers([]);
        setSearch("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredUsers = useMemo(() => {
    if (!search.trim()) return [];
    return users
      .filter(
        (user) =>
          user.username.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase())
      )
      .filter(
        (u) => !selectedMembers.some((m) => m.id === u.id) // avoid duplicates
      );
  }, [search, users, selectedMembers]);

  const addUserToSelection = (user: any) => {
    setSelectedMembers((prev) => [
      ...prev,
      { id: user.id, username: user.username, email: user.email, role: "member" },
    ]);
    setSearch("");
  };

  const updateUserRole = (id: number, role: string) => {
    setSelectedMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, role } : m))
    );
  };

  const removeSelectedUser = (id: number) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
        <h2 className="text-2xl font-semibold mb-4">Add Members</h2>

        {/* SEARCH INPUT */}
        <input
          type="text"
          placeholder="Search user by name or email…"
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* SEARCH DROPDOWN */}
        {search && (
          <div className="mt-2 bg-white border rounded-lg shadow max-h-40 overflow-y-auto">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user: any) => (
                <div
                  key={user.id}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-100"
                  onClick={() => addUserToSelection(user)}
                >
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              ))
            ) : (
              <p className="px-4 py-2 text-gray-500">No users found</p>
            )}
          </div>
        )}

        {/* SELECTED MEMBERS */}
        {selectedMembers.length > 0 && (
          <div className="mt-4 space-y-3">
            {selectedMembers.map((member) => (
              <div
                key={member.id}
                className="flex justify-between items-center bg-gray-100 border rounded-lg p-3"
              >
                <div>
                  <p className="font-semibold">{member.username}</p>
                  <p className="text-sm text-gray-600">{member.email}</p>
                </div>

                <div className="flex items-center gap-3">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      updateUserRole(member.id, e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg focus:ring-blue-400 focus:ring-2"
                  >
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>

                  <button
                    onClick={() => removeSelectedUser(member.id)}
                    className="text-red-500 font-bold hover:text-red-700"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              const data = selectedMembers.map((m) => ({
                userId: m.id,
                role: m.role,
              }));

              onAdd(data);
              onClose();
            }}
            disabled={selectedMembers.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition"
          >
            Add Members
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
