"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectDetail, updateProject } from "../../../services/projectService";
import { getProjectMembers } from "../../../services/memberService";
import { UserPlus, Pencil, X } from "lucide-react";
import { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import DeleteModal from "@/components/DeleteModal";
import AddMemberModal from "@/components/AddMemberModal";
import { useRouter } from "next/navigation";
import { useUsers } from "../../hooks/useUsers";
import RemoveMemberModal from "@/components/RemoveMemberModal";



export default function ProjectDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { deleteProject, addMember, removeMember } = useProjects();
  const { list:userList } = useUsers();

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);

  const [editData, setEditData] = useState({ name: "", description: "" });

  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);


  const router = useRouter();


  const projectQuery = useQuery({
    queryKey: ["project_detail", id],
    queryFn: () => getProjectDetail(Number(id)),
  });

  const membersQuery = useQuery({
    queryKey: ["project_members", id],
    queryFn: () => getProjectMembers(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => updateProject(Number(id), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project_detail", id] });
      setIsEditOpen(false);
    },
  });

  if (projectQuery.isLoading || membersQuery.isLoading)
    return (
      <div className="p-10 flex justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );

  if (projectQuery.isError || membersQuery.isError)
    return <p className="p-6 text-red-600">Failed to load project or members</p>;

  const project = projectQuery.data;
  const members = membersQuery.data ?? [];
  const projectId = project.id;

  const openEditModal = () => {
    setEditData({ name: project.name, description: project.description ?? "" });
    setIsEditOpen(true);
  };

  const openRemoveModal = (member: any) => {
    setSelectedMember(member);
    setIsRemoveOpen(true);
  };

  const handleRemoveMember = async () => {
  if (!selectedMember) return;

  await removeMember.mutateAsync({
    projectId,
    memberId: selectedMember.id,
  });

  queryClient.invalidateQueries({ queryKey: ["project_members", id] });
  setIsRemoveOpen(false);
};



  const handleUpdate = (e: any) => {
    e.preventDefault();
    updateMutation.mutate(editData);
  };

  const handleAddMember = async (members:[]) => {
    await Promise.all(
        members.map((m) =>
        addMember.mutateAsync({
            project: projectId,
            user: m.userId,
            role: m.role,
        })
        )
    );

    queryClient.invalidateQueries({ queryKey: ["project_members", id] });
    setIsAddMemberOpen(false);
  };



  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          {project.user_role && (
            <p className="text-gray-600 mt-2">Your Role: {project.user_role}</p>
          )}
          {project.description && (
            <p className="text-gray-600 mt-2">{project.description}</p>
          )}
        </div>

        {/* For multiple roles */}
        {/* {["owner", "admin", "manager"].includes(project.user_role) && (
          <div className="flex gap-3">
            ...
          </div>
        )} */}

        {/* Show only for project owner */}
        {project.user_role === "owner" && (
          <div className="flex gap-3">
            <button
              onClick={openEditModal}
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 shadow"
            >
              <Pencil size={18} /> Edit
            </button>

            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:opacity-90 transition"
            >
              <UserPlus size={18} /> Add Member
            </button>

            <button
              onClick={() => setIsDeleteOpen(true)}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow"
            >
              Delete
            </button>
          </div>
        )}
      </div>


      {/* MEMBERS LIST */}
      <div className="bg-white border rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Members ({members.length})</h2>
        {members.length === 0 ? (
          <p className="text-gray-500">No members in this project.</p>
        ) : (
          <ul className="space-y-4">
            {members.map((member: any) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 border-b pb-3"
                >
                <div className="flex items-center gap-4">
                    <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-semibold text-lg">
                    {member.username[0].toUpperCase()}
                    </div>
                    <div className="text-sm text-gray-700 space-y-1">
                    <p><span className="font-semibold">Name:</span> {member.username}</p>
                    <p><span className="font-semibold">Email:</span> {member.email}</p>
                    <p><span className="font-semibold">Designation:</span> {member.designation}</p>
                    <p><span className="font-semibold">Department:</span> {member.department}</p>
                    <p><span className="font-semibold">Job Role:</span> {member.job_role}</p>
                    </div>
                </div>
                {project.user_role === "owner" && (
                  <button
                      onClick={() => openRemoveModal(member)}
                      className="text-red-600 font-medium hover:underline"
                  >
                      Remove
                  </button>
                )}
               </li>
            ))}
          </ul>
        )}
      </div>

      {/* EDIT PROJECT MODAL */}
      {isEditOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setIsEditOpen(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-2xl font-semibold mb-4">Edit Project</h2>
            <form onSubmit={handleUpdate} className="grid gap-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder=" "
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                  className="peer w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
                  peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs
                ">
                  Project Name
                </label>
              </div>
              <div className="relative">
                <textarea
                  placeholder=" "
                  rows={4}
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="peer w-full px-4 py-3 border rounded-lg bg-white focus:ring-2 focus:ring-purple-400 outline-none"
                />
                <label className="absolute left-4 top-3 text-gray-500 transition-all
                  peer-placeholder-shown:top-3 peer-placeholder-shown:text-base
                  peer-focus:-top-2 peer-focus:text-xs peer-focus:text-purple-600
                  peer-[&:not(:placeholder-shown)]:-top-2 peer-[&:not(:placeholder-shown)]:text-xs
                ">
                  Description (optional)
                </label>
              </div>
              <button type="submit" className="mt-2 w-full bg-purple-600 text-white py-3 rounded-xl shadow hover:bg-purple-700 transition">
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => {
            deleteProject.mutate(projectId, {
            onSuccess: () => {
                setIsDeleteOpen(false);
                router.push("/projects"); // Redirect to projects page
            },
            });
        }}
        />


      {/* ADD MEMBER MODAL */}
      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
        users={userList?.data || []}
      />

      {/* REMOVE MEMBER MODAL */}
      <RemoveMemberModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={handleRemoveMember}
        memberName={selectedMember?.username || ""}
       />

    </div>
  );
}
