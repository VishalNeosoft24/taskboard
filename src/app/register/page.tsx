"use client";
import { useState } from "react";
import { registerUser } from "@/services/authService";


export default function RegisterPage() {
const [form, setForm] = useState({
username: "",
password: "",
first_name: "",
last_name: "",
email: "",
job_role: "",
department: "Engineering",
designation: "Software Engineer",
});


const handleChange = (e: any) => {
setForm({ ...form, [e.target.name]: e.target.value });
};


const handleRegister = async (e: any) => {
e.preventDefault();
try {
await registerUser(form);
alert("Registration successful");
window.location.href = "/login";
} catch (error) {
alert("Registration failed");
}
};


return (
<div className="p-6 max-w-md mx-auto">
<h1 className="text-2xl font-bold mb-4">Register</h1>


<form onSubmit={handleRegister} className="flex flex-col gap-3">
{Object.keys(form).map((key) => (
<input
key={key}
className="border p-2 rounded"
name={key}
placeholder={key}
value={(form as any)[key]}
onChange={handleChange}
/>
))}


<button className="bg-green-600 text-white p-2 rounded" type="submit">
Register
</button>
</form>
</div>
);
}