import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useUserById = (id: string) => {
    const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`;

  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const res = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
