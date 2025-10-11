// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // 1️⃣ Don't render anything until AuthContext finishes checking credentials
  if (loading) return null;

  // 2️⃣ If not authenticated, redirect once (no re-render loop)
  if (!isAuthenticated) {
    // Prevent redirect loops (don’t redirect if already on /login)
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  }

  // 3️⃣ Otherwise, allow access
  return children;
}
