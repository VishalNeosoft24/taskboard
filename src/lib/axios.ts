// src/lib/axios.ts
import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// 🟦 Add token to request
api.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Track if we've already handled logout to prevent multiple redirects
let hasLoggedOut = false;

// 🔴 Auto-logout on token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ❌ Token invalid or expired
    if (status === 401 && typeof window !== "undefined") {
      const isLoginPage = window.location.pathname === "/login";
      
      if (isLoginPage) {
        return Promise.reject(error);
      }

      if (!hasLoggedOut) {
        hasLoggedOut = true;

        // Clear localStorage tokens
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // 🍪 Clear cookie by expiring it
        document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

        toast.error("Session expired. Please login again.");

        window.location.replace("/login");
      }

      return Promise.reject(error);
    }

    // Other API errors
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      "Unexpected error";
    toast.error(msg);

    return Promise.reject(error);
  }
);

export default api;