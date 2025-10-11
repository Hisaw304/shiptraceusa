// src/pages/Login.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { username, password } = formData;

    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }

    // Call signIn from AuthContext
    const res = await auth.signIn({ username, password });
    if (res.ok) {
      toast.success("Welcome, admin");
      navigate(from, { replace: true });
      return;
    }

    toast.error(res.error || "Invalid credentials");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-accent)] p-6">
      <form
        onSubmit={handleSubmit}
        className="login-card w-full max-w-sm bg-white rounded-2xl shadow-lg p-8"
        aria-label="Admin login"
      >
        <div className="mb-6 text-center">
          <img
            src="/logo.png"
            alt="ShipTraceUSA"
            className="mx-auto w-12 h-12 object-contain"
          />
          <h1 className="mt-3 text-2xl font-bold text-[var(--color-primary)]">
            Admin Login
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sign in to access the admin dashboard
          </p>
        </div>

        {/* username */}
        <label className="block mb-3">
          <div className="input-wrap flex items-center gap-3 border rounded-full h-12 px-4">
            <Mail className="text-gray-400" size={16} />
            <input
              name="username"
              type="text"
              required
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
        </label>

        {/* password */}
        <label className="block mb-4">
          <div className="input-wrap flex items-center gap-3 border rounded-full h-12 px-4">
            <Lock className="text-gray-400" size={16} />
            <input
              name="password"
              type="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="flex-1 outline-none bg-transparent text-sm"
            />
          </div>
        </label>

        <div className="text-right mb-4">
          <button
            type="button"
            onClick={() =>
              toast("Please contact the site owner to reset the password.")
            }
            className="text-sm text-[var(--color-primary)]"
          >
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          className="w-full h-12 rounded-full text-white font-semibold bg-[var(--color-secondary)] hover:brightness-95 transition"
        >
          {auth.loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
