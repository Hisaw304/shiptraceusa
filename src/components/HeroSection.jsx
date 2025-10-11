import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";

const slides = [
  {
    id: 1,
    image: hero1,
    headline: "Trusted Shipping Across the USA",
    text: "ShipTraceUSA provides dependable logistics and delivery services nationwide — built on precision, trust, and modern tracking technology.",
  },
  {
    id: 2,
    image: hero2,
    headline: "Delivering Confidence, Every Mile",
    text: "From coast to coast, ShipTraceUSA ensures your parcels arrive safely, on time, and with real-time visibility at every step.",
  },
];

const preloadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(true);
    img.src = src;
    if (img.complete) resolve(true);
  });

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Preload once on mount
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  // Auto-advance with preload
  useEffect(() => {
    let mounted = true;
    let timerId;

    const scheduleNext = async () => {
      timerId = setTimeout(async () => {
        const next = (index + 1) % slides.length;
        await preloadImage(slides[next].image);
        if (!mounted) return;
        setPrevIndex(index);
        setIndex(next);
      }, 7000);
    };

    scheduleNext();
    return () => {
      mounted = false;
      clearTimeout(timerId);
    };
  }, [index]);

  const handleTrack = async () => {
    const id = trackingId.trim();
    if (!id) return toast.error("Please enter a tracking ID");

    setLoading(true);
    try {
      const res = await fetch(
        `/api/public/track?trackingId=${encodeURIComponent(id)}`
      );

      if (!res.ok) {
        const json = await res.json().catch(() => null);
        toast.error(json?.error || "Tracking ID not found");
        return;
      }

      navigate(`/track/${encodeURIComponent(id)}`);
    } catch {
      toast.error("Network error — try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="hero-container relative h-[80vh] md:h-[90vh] overflow-hidden">
      {/* Background images (prev + current) */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false} mode="sync">
          {prevIndex !== null && (
            <motion.img
              key={`img-${prevIndex}`}
              src={slides[prevIndex].image}
              alt={slides[prevIndex].headline}
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9 }}
              className="absolute inset-0 w-full h-full object-cover"
              style={{ zIndex: 0 }}
            />
          )}

          <motion.img
            key={`img-${index}`}
            src={slides[index].image}
            alt={slides[index].headline}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ zIndex: 0 }}
          />
        </AnimatePresence>
      </div>

      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60" style={{ zIndex: 5 }} />

      {/* CONTENT */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center text-white">
        {/* Animated headline + paragraph - keyed so they animate on slide change */}
        <motion.div
          key={`content-${index}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -24 }}
          transition={{ duration: 0.8, delay: 0.12 }}
          className="max-w-3xl"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
            {slides[index].headline}
          </h1>

          <p className="text-lg md:text-xl mb-8 text-gray-200">
            {slides[index].text}
          </p>
        </motion.div>

        {/* TRACKING INPUT + CTA
            Moved OUTSIDE the keyed animated block so it does NOT unmount when slides change.
            This preserves input focus/typing across background transitions.
        */}
        <div className="w-full max-w-xl mx-auto mt-6">
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Tracking ID"
                // keep stable styles; ensure it doesn't reflow badly
                className="
                  pl-10 pr-4 py-3 w-full rounded-full 
                  bg-white/95 text-gray-900 text-base font-medium
                  border border-gray-300 shadow-sm 
                  placeholder:text-gray-500 placeholder:text-base placeholder:font-medium
                  focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] focus:ring-offset-0
                  transition-colors duration-200
                "
              />
            </div>

            {/* CTA: flex-none + min-w prevents input shrink when label changes.
                Use 'group' so arrow rotates when hovering the whole button */}
            <button
              onClick={handleTrack}
              disabled={loading}
              className={`group flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md transition-all duration-300 ${
                loading
                  ? "bg-gray-400 cursor-not-allowed text-white"
                  : "bg-[var(--color-secondary)] hover:bg-orange-600 text-white"
              }`}
              // keep pointer events normal when disabled
            >
              {loading ? (
                "Checking..."
              ) : (
                <>
                  {/* stable label */}
                  <span className="whitespace-nowrap">Track Your Order</span>
                  {/* arrow rotates left when parent (button) is hovered via Tailwind group-hover */}
                  <ArrowUp className="ml-1 transform transition-transform duration-200 group-hover:-rotate-90" />
                </>
              )}
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-300">
            Example:{" "}
            <span className="text-[var(--color-secondary)]">
              15b6fc6f-327a...
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
