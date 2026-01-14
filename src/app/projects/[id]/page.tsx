"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProjectDetail, updateProject } from "../../../services/projectService";
import { getProjectMembers } from "../../../services/memberService";
import { Trash2, UserPlus, Plus } from "lucide-react";
import { useState, FormEvent } from "react";
import { useProjects } from "../../hooks/useProjects";
import { useUsers } from "../../hooks/useUsers";
import DeleteModal from "@/components/DeleteModal";
import AddMemberModal from "@/components/AddMemberModal";
import RemoveMemberModal from "@/components/RemoveMemberModal";
import Link from "next/link";
import PermissionBadge from "@/components/PermissionBadge";
import { useCurrentUser } from "../../hooks/useCurrentUser";
import CreateTaskForm from "../../tasks/components/CreateTaskForm";
import CreateTaskModal from "@/components/CreateTaskModal";
import { useTasks } from "@/app/hooks/useTasks";
import { TaskSummaryCard } from "@/components/TaskSummaryCard";

/* ------------------------------------------------------------------ */
/*                           TYPE DEFINITIONS                         */
/* ------------------------------------------------------------------ */

interface ProjectPermissions {
  can_create_task?: boolean;
}

interface ProjectSummary {
  project_summary: Record<string, number>;
  user_summary: Record<string, number>;
}

interface Project {
  id: number;
  name: string;
  description: string;
  user_role: string;
  permissions?: ProjectPermissions;
  summary?: ProjectSummary;
}

interface Task {
  id: number;
  name: string;
  status: string;
  priority: string;
}

interface Member {
  id: number;
  username: string;
  email: string;
  project_role: string;
  tasks?: Task[];
}

interface AddMemberPayload {
  userId: number;
  role: string;
}

/* ------------------------------------------------------------------ */

export default function ProjectDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { deleteProject, addMember, removeMember } = useProjects(1, {});
  const { list: userList } = useUsers(1, "");
  const { user } = useCurrentUser();
  const { add } = useTasks(1, {});

  /* ------------------------------ STATE ------------------------------ */

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [projectId, setProjectId] = useState(id);

  /* ------------------------------ TASK ------------------------------- */

  const handleAddTask = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Task title required");
      return;
    }

    await add.mutateAsync({
      name: title,
      description,
      priority,
      project: projectId,
    });

    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["project_detail", id] }),
      queryClient.invalidateQueries({ queryKey: ["project_members", id] }),
      queryClient.invalidateQueries({ queryKey: ["tasks"] }),
    ]);

    setTitle("");
    setDescription("");
    setPriority("low");
    setProjectId(id);
    setIsCreateTaskOpen(false);
  };

  /* ------------------------------ QUERIES ---------------------------- */

  const projectQuery = useQuery<Project>({
    queryKey: ["project_detail", id],
    queryFn: () => getProjectDetail(Number(id)),
  });

  const membersQuery = useQuery<Member[]>({
    queryKey: ["project_members", id],
    queryFn: () => getProjectMembers(Number(id)),
  });

  useMutation({
    mutationFn: updateProject,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["project_detail", id] }),
  });

  const project = projectQuery.data;
  const members = membersQuery.data ?? [];

  /* ------------------------------ CHECKS ----------------------------- */

  const isCurrentUserMember = members.some(
    (member) => member.username === user.data.username
  );

  if (projectQuery.isLoading || membersQuery.isLoading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (!project) {
    return <div className="p-10 text-center">Project not found!</div>;
  }

  /* ------------------------------ HANDLERS --------------------------- */

  const handleRemoveMember = async (): Promise<void> => {
    if (!selectedMember) return;

    await removeMember.mutateAsync({
      projectId: project.id,
      memberId: selectedMember.id,
    });

    queryClient.invalidateQueries({ queryKey: ["project_members", id] });
    setIsRemoveOpen(false);
  };

  const handleAddMember = async (
    selected: AddMemberPayload[]
  ): Promise<void> => {
    if (!selected.length) return;

    await Promise.all(
      selected.map(({ userId, role }) =>
        addMember.mutateAsync({
          project: project.id,
          user: userId,
          role,
        })
      )
    );

    queryClient.invalidateQueries({ queryKey: ["project_members", id] });
    setIsAddMemberOpen(false);
  };

  const canCreateTask =
    project.permissions?.can_create_task === true ||
    user.data.role === "superadmin";

  const isHigherRole =
    user.data.role === "superadmin" ||
    project.user_role === "owner" ||
    project.user_role === "admin" ||
    user.data.role === "staff";

  /* ------------------------------ JSX ------------------------------- */

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      {/* HEADER */}
      {/* <div className="flex justify-between items-start bg-white/40 backdrop-blur-md shadow-lg p-6 rounded-2xl border">
        <div>
          <h1 className="text-4xl font-extrabold">{project.name}</h1>
          <p className="text-gray-600 mt-2">{project.description}</p>

          {isCurrentUserMember ? (
            <>
              <span className="inline-block mt-3 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Your Project Role: {project.user_role}
              </span>

              {user.data.role === "superadmin" && (
                <span className="ml-2 inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Global Role: SuperAdmin
                </span>
              )}

              {user.data.role === "staff" && (
                <span className="ml-2 inline-block mt-3 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Global Role: Staff
                </span>
              )}

              <PermissionBadge
                role={project.user_role || user.data.role}
                permissions={project.permissions}
              />
            </>
          ) : (
            <>
              <span className="inline-block mt-3 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Global Role: {user.data.role}
              </span>

              <span className="ml-2 inline-block mt-3 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Not a Project Member
              </span>

              <PermissionBadge
                role={user.data.role}
                permissions={project.permissions}
              />
            </>
          )}
        </div>

        {(project.user_role === "owner" ||
          user.data.role === "superadmin" ||
          project.permissions?.can_create_task) && (
          <div className="flex gap-3 flex-shrink-0 mt-3">
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

            {(project.user_role === "owner" ||
              user.data.role === "superadmin") && (
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
      </div> */}

      <div className="bg-white/40 backdrop-blur-md shadow-lg p-6 rounded-2xl border">
        {/* Row 1: Project Name + Action Buttons */}
        <div className="flex justify-between items-center mb-3">
          <h1 className="text-4xl font-extrabold truncate">{project.name}</h1>

          {(project.user_role === "owner" ||
            user.data.role === "superadmin" ||
            project.permissions?.can_create_task) && (
            <div className="flex gap-3 flex-wrap">
              {canCreateTask && (
                <button
                  className="button-primary whitespace-nowrap"
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
                    className="button-primary whitespace-nowrap"
                    onClick={() => setIsAddMemberOpen(true)}
                  >
                    <UserPlus size={18} /> Add Member
                  </button>

                  <button
                    className="button-danger whitespace-nowrap"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Row 2: Project Description */}
        <p className="text-gray-600 mb-3">{project.description}</p>

        {/* Row 3: Roles / Global Roles */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isCurrentUserMember ? (
            <>
              <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Your Role: {project.user_role}
              </span>

              {(user.data.role === "superadmin" || user.data.role === "staff") && (
                <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm shadow-sm">
                  Global Role: {user.data.role === "superadmin" ? "SuperAdmin" : "Staff"}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Global Role: {user.data.role}
              </span>

              <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm shadow-sm">
                Not a Project Member
              </span>
            </>
          )}
        </div>

        {/* Row 4: Permissions Badge */}
        <PermissionBadge
          role={project.user_role || user.data.role}
          permissions={project.permissions}
        />
      </div>

      {/* SUMMARY CARDS */}
      {project.summary && (
        <div className="space-y-6">
          {isHigherRole && (
            <TaskSummaryCard
              title="📊 Project Task Summary"
              summary={project.summary.project_summary}
            />
          )}
          {project.summary.user_summary.total_tasks > 0 && (
            <TaskSummaryCard
              title="🧑‍💻 Your Task Summary"
              summary={project.summary.user_summary}
            />
          )}
        </div>
      )}

      {/* MEMBERS LIST */}
      <div className="bg-white shadow-md rounded-2xl border p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Team Members</h2>
          <span className="text-gray-500">Total: {members.length}</span>
        </div>

        <div className="grid gap-6">
          {members.map((member) => {
            const isCurrentUser =
              member.username === user.data.username;

            return (
              <div
                key={member.id}
                className="rounded-xl border bg-gray-50 p-5 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-4 items-center">
                    <div className="bg-purple-200 text-purple-700 h-12 w-12 rounded-full flex items-center justify-center font-bold text-lg">
                      {member.username[0]?.toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-lg">
                          {member.username}
                        </p>

                        {isCurrentUser && (
                          <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-2.5 py-0.5 rounded-full font-medium shadow-sm animate-pulse">
                            You
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-600">
                        {member.email}
                      </p>

                      <span className="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-md">
                        {member.project_role}
                      </span>
                    </div>
                  </div>

                  {!isCurrentUser &&
                    (project.user_role === "owner" ||
                      user.data.role === "superadmin") && (
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

                {member.tasks?.length ? (
                  <div className="mt-4">
                    <p className="font-medium text-gray-700 mb-2">
                      Assigned Tasks:
                    </p>

                    <ul className="grid gap-2">
                      {member.tasks.map((task) => (
                        <li key={task.id}>
                          <Link
                            href={`/tasks/${task.id}`}
                            className="block text-sm bg-white p-3 border rounded-lg shadow-sm hover:bg-purple-50 hover:border-purple-300 transition"
                          >
                            <p className="font-semibold">{task.name}</p>
                            <p className="text-gray-500">
                              Status: {task.status}
                            </p>
                            <p className="text-gray-500">
                              Priority: {task.priority}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
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
