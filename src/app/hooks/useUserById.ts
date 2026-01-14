import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useUserById = (id: string) => {
  const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/`;

  return useQuery({
    queryKey: ["user", id],

    queryFn: async () => {
      try {
        const res = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });

        return res.data;
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          "Something went wrong while fetching user";

        // 🔔 Show backend error message
        toast.error(message);

        // ❗ Important: rethrow so React Query knows this failed
        throw error;
      }
    },

    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
