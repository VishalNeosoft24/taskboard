"use client";

import { useParams } from "next/navigation";
import { useTasks } from "../../hooks/useTasks";
import { useTaskMessages } from "../../hooks/useTaskMessages";
import TaskDetail from "@/components/TaskDetail";
import TaskChat from "@/components/TaskChat";

export default function TaskDetailPage() {
  const { id } = useParams();
  const { getTask, updateTaskById } = useTasks();
  const taskId = Number(id);

  const { data: task, isLoading } = getTask(taskId);
  const { messages, sendMessage, editComment, removeComment } = useTaskMessages(taskId);

  if (isLoading) return <p className="p-6">Loading task...</p>;
  if (!task) return <p className="p-6 text-red-500">Task not found.</p>;

  // Call updateTaskById mutation
  const handleStatusChange = (status: string) => {
    updateTaskById.mutate({ id: taskId, data: { status } });
  };

  const handlePriorityChange = (priority: string) => {
    updateTaskById.mutate({ id: taskId, data: { priority } });
  };

  const handleTaskUpdate = (data: any) => {
    updateTaskById.mutate({
      id: taskId,
      data,
    });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <TaskDetail
        task={task}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
        onUpdate={handleTaskUpdate}
      />

      <TaskChat
        messages={messages}
        sendMessage={sendMessage}
        editComment={editComment}
        removeComment={removeComment}
      />
    </div>
  );
}
