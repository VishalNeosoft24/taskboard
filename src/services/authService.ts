import api from "@/lib/axios";


export const loginUser = async (payload: { username: string; password: string }) => {
const res = await api.post("/users/user_login/", payload);
return res.data;
};


export const registerUser = async (payload: any) => {
const res = await api.post("/users/", payload);
return res.data;
};