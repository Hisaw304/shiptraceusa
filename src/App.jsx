import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import TrackingPage from "./pages/TrackingPage";
import Footer from "./components/Footer";
import AdminPage from "./pages/AdminPage";
import TrackSearchPage from "./pages/TrackSearchPage";
import About from "./pages/About";
import Preloader from "./components/Preloader";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";

const App = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowPreloader(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
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
          },
        }}
      />

      <Preloader
        visible={showPreloader}
        onHidden={() => setShowPreloader(false)}
      />
      <Navbar />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/track/:id" element={<TrackingPage />} />
          <Route path="/track" element={<TrackSearchPage />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
