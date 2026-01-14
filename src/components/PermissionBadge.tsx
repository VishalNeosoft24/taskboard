"use client";

interface PermissionBadgeProps {
  role: string;
  permissions: Record<string, boolean>;
}

const permissionLabels: Record<string, string> = {
  can_view_project: "View project",
  can_create_task: "Create tasks",
  can_edit_task: "Edit tasks",
  can_delete_task: "Delete tasks",
  can_add_member: "Add members",
  can_remove_member: "Remove members",
  can_update_project: "Update project",
  can_delete_project: "Delete project",
};

export default function PermissionBadge({ role, permissions }: PermissionBadgeProps) {
  if (!permissions) return null;
  
  const allowed = Object.entries(permissions)
    .filter(([_, v]) => v)
    .map(([k]) => permissionLabels[k]);

  return (
    <div className="mt-4 bg-gray-50 border rounded-xl p-4 shadow-sm">
      <h3 className="font-semibold text-gray-700 mb-2">
        Your Permissions ({role})
      </h3>

      {allowed.length > 0 ? (
        <ul className="grid grid-cols-2 gap-x-6 gap-y-1 text-gray-700 list-disc pl-5">
          {allowed.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No permissions.</p>
      )}
    </div>
  );
}
