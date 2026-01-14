// src/hooks/useCurrentUser.ts
import { decodeToken } from "@/lib/jwt";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCurrentUser = () => {
  
  // Get JWT & decode
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const decoded = decodeToken(token);
  const userId = decoded?.user_id;

  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/`;


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
