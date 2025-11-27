// src/hooks/useCurrentUser.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/users/2/";

export const useCurrentUser = () => {
  const queryClient = useQueryClient();

  const user = useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
  });

  const update = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.patch(API_URL, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["currentUser"] }),
  });

  return { user, update };
};
