// import axios from "axios";

// const api = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
//   withCredentials: true, // sends HttpOnly refresh cookie
// });

// // Add access token to all requests
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Handle expired access token
// let isRefreshing = false;
// let failedQueue: any[] = [];

// const processQueue = (error: any, token: string | null = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });

//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (res) => res,
//   async (error) => {
//     const originalRequest = error.config;

//     // Token expired?
//     if (
//       error.response?.status === 401 &&
//       error.response.data?.code === "token_not_valid" &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       if (isRefreshing) {
//         return new Promise(function (resolve, reject) {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers["Authorization"] = "Bearer " + token;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       isRefreshing = true;

//       try {
//         const refreshRes = await api.post("/refresh/");
//         const newAccess = refreshRes.data.access;

//         localStorage.setItem("access_token", newAccess);
//         processQueue(null, newAccess);

//         isRefreshing = false;

//         originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
//         return api(originalRequest);
//       } catch (err) {
//         processQueue(err, null);
//         isRefreshing = false;

//         // Hard logout
//         localStorage.removeItem("access_token");
//         window.location.href = "/login";

//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;




// // src/lib/axios.ts
// import axios from 'axios';


// const api = axios.create({
// baseURL: process.env.NEXT_PUBLIC_API_URL,
// withCredentials: true, // to allow refresh token cookie
// });


// // simple request interceptor to add access token from memory/localStorage
// api.interceptors.request.use((config) => {
// const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
// if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
// return config;
// });


// export default api;


// src/lib/axios.ts
import axios from "axios";
import toast from "react-hot-toast";


const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // allow refresh token cookie if used
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

// 🔴 Auto-logout on token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const errData = error.response?.data;
    const msg =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      "Unexpected error";

    const isExpired =
      errData?.code === "token_not_valid" ||
      errData?.detail === "Given token not valid for any token type";

    if (isExpired) {
      // Remove tokens
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // Redirect to login page
      window.location.href = "/login";
    }
    toast.error(msg);
    return Promise.reject(error);
  }
);

export default api;
