// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = sessionStorage.getItem("shiptrace_auth");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Keep session in sync across tabs (optional)
    const onStorage = (e) => {
      if (e.key === "shiptrace_auth") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // signIn: call backend serverless login endpoint
  const signIn = async ({ username, password }) => {
    setLoading(true);
    try {
      const resp = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        // bubble up error message
        throw new Error(data?.error || "Login failed");
      }

      // login success
      const userPayload = data.user;
      setUser(userPayload);
      sessionStorage.setItem("shiptrace_auth", JSON.stringify(userPayload));
      setLoading(false);
      return { ok: true, user: userPayload };
    } catch (err) {
      setLoading(false);
      return { ok: false, error: err.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("shiptrace_auth");
    // Optionally call backend logout to clear cookie/session
    // fetch('/api/logout', { method: 'POST', credentials: 'include' });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        signIn, // async signIn
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
