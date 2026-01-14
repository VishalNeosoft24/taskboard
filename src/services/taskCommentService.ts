import api from "@/lib/axios";

export const addTaskComment = async (payload: {
  user: number;
  task: number;
  comment: string;
}) => {
  const res = await api.post("/tasks/comment/", payload);
  return res.data;
};

export const fetchTaskComments = async (taskId: number) => {
  const res = await api.get(`/tasks/comment/${taskId}/`);
  return res.data.comments;
};

// ✅ Edit Comment
export const updateTaskComment = async (commentId: number, payload: { comment: string }) => {
  const res = await api.patch(`/tasks/comment/${commentId}/`, payload);
  return res.data;
};

// ✅ Delete Comment
export const deleteTaskComment = async (commentId: number) => {
  const res = await api.delete(`/tasks/comment/${commentId}/`);
  return res.data;
}