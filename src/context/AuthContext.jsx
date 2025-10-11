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

  useEffect(() => {
    // keep session in sync for tabs (optional)
    const onStorage = (e) => {
      if (e.key === "shiptrace_auth") {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = (payload) => {
    setUser(payload);
    sessionStorage.setItem("shiptrace_auth", JSON.stringify(payload));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("shiptrace_auth");
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
