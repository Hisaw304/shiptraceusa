// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null; // or a spinner component

  if (!isAuthenticated) {
    if (location.pathname !== "/login") {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
    return null;
  }

  return children;
}
