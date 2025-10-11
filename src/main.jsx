// src/main.jsx
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import React from "react";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import "./assets/style.css";
import "./assets/backend.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
