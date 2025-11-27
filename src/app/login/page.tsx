"use client";
import { useState } from "react";
import { loginUser } from "@/services/authService";


export default function LoginPage() {
const [username, setUsername] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");


const handleLogin = async (e: any) => {
e.preventDefault();
try {
const res = await loginUser({ username, password });
localStorage.setItem("access_token", res.access);
document.cookie = `access_token=${res.access}; path=/`;
alert("Login Successful");
window.location.href = "/tasks";
} catch (err: any) {
setError("Invalid credentials");
}
};


return (
<div className="p-6 max-w-md mx-auto">
<h1 className="text-2xl font-bold mb-4">Login</h1>


{error && <p className="text-red-500">{error}</p>}


<form onSubmit={handleLogin} className="flex flex-col gap-3">
<input
className="border p-2 rounded"
placeholder="Username"
value={username}
onChange={(e) => setUsername(e.target.value)}
/>


<input
className="border p-2 rounded"
placeholder="Password"
type="password"
value={password}
onChange={(e) => setPassword(e.target.value)}
/>


<button className="bg-blue-600 text-white p-2 rounded" type="submit">
Login
</button>
</form>
</div>
);
}