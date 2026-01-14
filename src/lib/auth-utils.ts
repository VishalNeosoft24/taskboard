// src/lib/auth-utils.ts
export const handleLogout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // Use Next.js navigation
    window.location.replace("/login");
  }
};