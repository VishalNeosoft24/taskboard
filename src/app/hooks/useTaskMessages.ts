import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addTaskComment,
  fetchTaskComments,
  updateTaskComment,
  deleteTaskComment,
} from "@/services/taskCommentService";

export function useTaskMessages(taskId: number) {
  const qc = useQueryClient();
  const [socket, setSocket] = useState<Socket | null>(null);

  // -------------------------
  // Load comments from API
  // -------------------------
  const { data, isLoading } = useQuery({
    queryKey: ["task_comments", taskId],
    queryFn: () => fetchTaskComments(taskId),
  });

  // -------------------------------------------
  // Optional WebSocket Integration (Disabled)
  // -------------------------------------------
  //
  // If you want to enable real-time comments later, uncomment this.
  //
  // useEffect(() => {
  //   const s = io("http://127.0.0.1:8000");
  //   setSocket(s);
  //
  //   s.emit("join_task_room", taskId);
  //
  //   s.on("task_message", (msg) => {
  //     qc.setQueryData(["task_comments", taskId], (old: any[] = []) => [
  //       ...old,
  //       msg,
  //     ]);
  //   });
  //
  //   return () => s.disconnect();
  // }, [taskId, qc]);
  //

  // -------------------------
  // Add Comment
  // -------------------------
  const sendComment = useMutation({
    mutationFn: addTaskComment,
    onSuccess: (data) => {
      qc.invalidateQueries(["task_comments", taskId]);

      // If WebSocket enabled, send real-time broadcast
      if (socket) {
        socket.emit("task_message", data);
      }
    },
  });

  // -------------------------
  // Edit Comment
  // -------------------------
  const editComment = useMutation({
    mutationFn: ({ id, text }: { id: number; text: string }) =>
      updateTaskComment(id, { comment: text }),
    onSuccess: () => {
      qc.invalidateQueries(["task_comments", taskId]);
    },
  });

  // -------------------------
  // Delete Comment
  // -------------------------
  const removeComment = useMutation({
    mutationFn: (id: number) => deleteTaskComment(id),
    onSuccess: () => {
      qc.invalidateQueries(["task_comments", taskId]);
    },
  });

  // -------------------------
  // Public send function
  // -------------------------
  const sendMessage = (comment: string, userId: number) => {
    if (!comment.trim()) return;

    sendComment.mutate({
      user: userId,
      task: taskId,
      comment,
    });
  };

  return {
    messages: data || [],
    sendMessage,
    editComment,
    removeComment,
    isLoading,
  };
}
