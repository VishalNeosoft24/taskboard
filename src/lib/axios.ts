// src/lib/axios.ts
import axios from 'axios';


const api = axios.create({
baseURL: process.env.NEXT_PUBLIC_API_URL,
withCredentials: true, // to allow refresh token cookie
});


// simple request interceptor to add access token from memory/localStorage
api.interceptors.request.use((config) => {
const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
return config;
});


export default api;