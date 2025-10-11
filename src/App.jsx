import React from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import TrackingPage from "./pages/TrackingPage";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import TrackSearchPage from "./pages/TrackSearchPage";
import About from "./pages/About";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Toast notifications */}
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--color-primary)",
            color: "#fff",
            fontWeight: 500,
            borderRadius: "10px",
            padding: "12px 18px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
          },
          success: {
            iconTheme: {
              primary: "var(--color-secondary)",
              secondary: "#fff",
            },
          },
          error: {
            style: {
              background: "#dc2626", // red for errors
            },
          },
        }}
      />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/track/:id" element={<TrackingPage />} />
          <Route path="/track" element={<TrackSearchPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
