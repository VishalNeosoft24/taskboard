"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectDetail, getProjectTaskSummary, updateProject } from "../../../services/projectService";
import { getProjectMembers } from "../../../services/memberService";
import { Pencil, Trash2, UserPlus, Plus } from "lucide-react";
import { useState } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useUsers } from "../../hooks/useUsers";
import DeleteModal from "@/components/DeleteModal";
import AddMemberModal from "@/components/AddMemberModal";
import RemoveMemberModal from "@/components/RemoveMemberModal";
import Link from "next/link";
import PermissionBadge from "@/components/PermissionBadge";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import CreateTaskForm  from "../../tasks/components/CreateTaskForm";
import CreateTaskModal from "@/components/CreateTaskModal";
import { useTasks } from "@/app/hooks/useTasks";
import { TaskSummaryCard } from "@/components/TaskSummaryCard";



export default function ProjectDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { deleteProject, addMember, removeMember } = useProjects(1, {});
  const { list: userList } = useUsers();
  const { user } = useCurrentUser();
  const { add } = useTasks(1, {});

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Create Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [projectId, setProjectId] = useState(String(id)); // auto-select current project
  const [projectCreateText, setProjectCreateText] = useState("");

  const handleAddTask = async (e: any) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title required");
      return;
    }

    await add.mutateAsync({
      name: title,
      description,
      priority,
      project: projectId || null,
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project_task_summary", id] }),
      queryClient.invalidateQueries({ queryKey: ["project_members", id] }),
      queryClient.invalidateQueries({ queryKey: ["project_detail", id] }),
      queryClient.invalidateQueries({ queryKey: ["tasks"] }), // if task list page exists
    ]);

    // reset
    setTitle("");
    setDescription("");
    setPriority("low");
    setProjectId(String(id));
    setIsCreateTaskOpen(false);
  };

  // const summaryQuery = useQuery({
  //   queryKey: ["project_task_summary", id],
  //   queryFn: () => getProjectTaskSummary(Number(id)),
  // });

  const projectQuery = useQuery({
    queryKey: ["project_detail", id],
    queryFn: () => getProjectDetail(Number(id)),
  });

  const membersQuery = useQuery({
    queryKey: ["project_members", id],
    queryFn: () => getProjectMembers(Number(id)),
  });

  const updateMutation = useMutation({
    mutationFn: updateProject,
    onSuccess: () => queryClient.invalidateQueries(["project_detail", id]),
  });

  const project = projectQuery.data;
  const members = membersQuery.data || [];
  // const summary = summaryQuery.data;


  const isCurrentUserMember = members.some(
    (member: any) => member.username === user.data.username
  );

  if (projectQuery.isLoading || membersQuery.isLoading)
    return <div className="p-10 text-center">Loading...</div>;

  if (!project)
    return <div className="p-10 text-center">Project not found!</div>;

  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    await removeMember.mutateAsync({
      projectId: project.id,
      memberId: selectedMember.id,
    });

    queryClient.invalidateQueries(["project_members", id]);
    setIsRemoveOpen(false);
  };

  const handleAddMember = async (selected: any[])   => {
    if (!selected) return;

    await Promise.all(
      selected.map((m) =>
        addMember.mutateAsync({
          project: project.id,
          user: m.userId,
          role: m.role,
        })
      )
    );

    queryClient.invalidateQueries(["project_members", id]);
    setIsAddMemberOpen(false);
  };

  const canCreateTask =
  project?.permissions?.can_create_task === true ||
  user.data.role === "superadmin";

  const isHigherRole =
  user.data.role === "superadmin" ||
  project.user_role === "owner" ||
  project.user_role === "admin" ||
  user.data.role === "staff";




  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      
      {/* HEADER */}
      <div className="flex justify-between items-start bg-white/40 backdrop-blur-md shadow-lg p-6 rounded-2xl border">
        <div>
          <h1 className="text-4xl font-extrabold">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>

          {/* 1️⃣ USER IS PROJECT MEMBER */}
          {isCurrentUserMember && (
            <>
              <span className="inline-block mt-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Your Project Role: {project.user_role}
              </span>

              {/* If global role is SuperAdmin, show extra badge */}
              {user.data.role === "superadmin" && (
                <span className="ml-2 inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Global Role: SuperAdmin
                </span>
              )}

              {/* If global role is Staff, show extra badge */}
              {user.data.role === "staff" && (
                <span className="ml-2 inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Global Role: Staff
                </span>
              )}

              {/* Permission badge based on project role */}
              <PermissionBadge   
                role={project.user_role || user.data.role}
                permissions={project.permissions}
              />
            </>
          )}

          {/* 2️⃣ USER IS NOT PROJECT MEMBER */}
          {!isCurrentUserMember && (
            <>
              <span className="inline-block mt-3 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Global Role: {user.data.role}
              </span>

              <span className="ml-2 inline-block mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Not a Project Member
              </span>

              {/* Permission badge based on global role */}
              <PermissionBadge role={user.data.role} permissions={project.permissions} />
            </>
          )}
        </div>
        
        {(project.user_role === "owner" ||
          user.data.role === "superadmin" ||
          project.permissions?.can_create_task) && (
          <div className="flex gap-3">
            {canCreateTask && (
              <button
                className="button-primary"
                onClick={() => {
                  setProjectId(String(project.id));
                  setIsCreateTaskOpen(true);
                }}              
                >
                <Plus size={18} /> Create Task
              </button>
            )}

            {(project.user_role === "owner" || user.data.role === "superadmin") && (
              <>
                <button
                  className="button-primary"
                  onClick={() => setIsAddMemberOpen(true)}
                >
                  <UserPlus size={18} /> Add Member
                </button>

                <button
                  className="button-danger"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 size={18} /> Delete
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {project.summary && (
        <div className="space-y-6">
        {
          isHigherRole && (
            <TaskSummaryCard
              title="📊 Project Task Summary"
              summary={project.summary.project_summary}
            />
          )
        }
          <TaskSummaryCard
            title="🧑‍💻 Your Task Summary"
            summary={project.summary.user_summary}
          />
        </div>
      )}

      {/* MEMBERS LIST */}
      <div className="bg-white shadow-md rounded-2xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Team Members</h2>
          <span className="text-gray-500">Total: {members.length}</span>
        </div>

        <div className="grid gap-6">
          {members.map((member: any) => {
            const isCurrentUser = member.username === user.data.username;

            return (
              <div
                key={member.id}
                className="rounded-xl border bg-gray-50 p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="bg-purple-200 text-purple-700 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {member.username?.[0]?.toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">{member.username}</p>

                        {/* ✅ CURRENT USER BADGE */}
                        {isCurrentUser && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm animate-pulse">
                            You
                          </span>
                        )}

                      </div>

                      <p className="text-sm text-gray-600">{member.email}</p>

                      <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
                        {member.project_role}
                      </span>
                    </div>
                  </div>

                  {!isCurrentUser &&
                    (project.user_role === "owner" || user.data.role === "superadmin") && (
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setIsRemoveOpen(true);
                        }}
                        className="text-red-600 font-medium hover:underline"
                      >
                        Remove
                      </button>
                  )}
                </div>

                {/* TASKS */}
                {member.tasks?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">Assigned Tasks:</p>
                    <ul className="grid gap-2">
                      {member.tasks.map((task: any) => (
                        <li key={task.id} className="list-none">
                          <Link
                            href={`/tasks/${task.id}`}
                            className="block text-sm bg-white p-3 border rounded-lg shadow-sm hover:bg-purple-50 hover:border-purple-300 transition"
                          >
                            <p className="font-semibold">{task.name}</p>
                            <p className="text-gray-500">Status: {task.status}</p>
                            <p className="text-gray-500">Priority: {task.priority}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>

      {/* MODALS */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() =>
          deleteProject.mutate(project.id, {
            onSuccess: () => router.push("/projects"),
          })
        }
      />

      <AddMemberModal
        isOpen={isAddMemberOpen}
        onClose={() => setIsAddMemberOpen(false)}
        onAdd={handleAddMember}
        users={userList?.data || []}
      />

      <RemoveMemberModal
        isOpen={isRemoveOpen}
        onClose={() => setIsRemoveOpen(false)}
        onConfirm={handleRemoveMember}
        memberName={selectedMember?.username}
      />

      <CreateTaskModal
      isOpen={isCreateTaskOpen}
      onClose={() => setIsCreateTaskOpen(false)}
    >
      <CreateTaskForm
        title={title}
        description={description}
        priority={priority}
        projectId={String(project.id)}
        projectName={project.name}
        setTitle={setTitle}
        setDescription={setDescription}
        setPriority={setPriority}
        onSubmit={handleAddTask}
      />

    </CreateTaskModal>

    </div>
  );
}
