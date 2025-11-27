// src/hooks/useUsers.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/";

export const useUsers = () => {
  const queryClient = useQueryClient();

  // ✅ List users
  const list = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data.users;
    },
  });

  // ✅ Update user
  const update = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      const res = await axios.patch(`${API_URL}${id}/`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return { list, update };
};
