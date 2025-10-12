// src/pages/TrackSearchPage.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, ArrowUp } from "lucide-react";
import HowItWorks from "../components/HowItWorks"; // existing component (rendered below)
import topBg from "../assets/service-road.jpg"; // replace with your chosen image (optional)

const RECENT_KEY = "shiptrace_recent_tracks_v1";

export default function TrackSearchPage() {
  const [trackingId, setTrackingId] = useState("");
  const [recent, setRecent] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem(RECENT_KEY);
    if (raw) {
      try {
        setRecent(JSON.parse(raw));
      } catch {
        setRecent([]);
      }
    }
  }, []);

  // helper to store recent searches (keeps unique last 6)
  const pushRecent = (id) => {
    if (!id) return;
    const normalized = id.trim();
    if (!normalized) return;
    const next = [normalized, ...recent.filter((r) => r !== normalized)].slice(
      0,
      6
    );
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // ignore storage errors
    }
  };

  // Navigate to the tracking details page. We intentionally DON'T pre-validate here;
  // the TrackingPage will display the definitive result and proper messaging.
  const handleTrack = (e) => {
    if (e) e.preventDefault();
    const id = trackingId.trim();
    if (!id) {
      toast.error("Please enter a tracking ID");
      inputRef.current?.focus();
      return;
    }
    pushRecent(id);
    // navigate to the tracking details page
    navigate(`/track/${encodeURIComponent(id)}`);
  };

  // quick handler for clicking recent chips
  const handleRecentClick = (id) => {
    setTrackingId(id);
    pushRecent(id);
    navigate(`/track/${encodeURIComponent(id)}`);
  };

  // keyboard: Enter triggers search
  const onKeyDown = (e) => {
    if (e.key === "Enter") handleTrack(e);
  };

  return (
    <div className="track-search-page">
      {/* Top background area (only for this page) */}
      <section
        className="track-top relative overflow-hidden"
        style={{
          backgroundImage: topBg ? `url(${topBg})` : undefined,
          backgroundColor: "var(--color-accent)",
        }}
      >
        <div
          className="track-top-overlay absolute inset-0 bg-black/40"
          aria-hidden
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          {/* small decorative label with left/right shapes */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="shape shape-left" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  fill="var(--color-secondary)"
                />
                <circle
                  cx="56.5"
                  cy="2.5"
                  r="2.5"
                  fill="var(--color-secondary)"
                />
              </svg>
            </span>

            <span className="uppercase text-sm font-semibold text-[var(--color-primary)]">
              TRACKING
            </span>

            <span className="shape shape-right" aria-hidden>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="59"
                height="5"
                viewBox="0 0 59 5"
                fill="none"
              >
                <rect
                  width="50"
                  height="5"
                  rx="2.5"
                  transform="matrix(-1 0 0 1 59 0)"
                  fill="var(--color-secondary)"
                />
                <circle
                  cx="2.5"
                  cy="2.5"
                  r="2.5"
                  transform="matrix(-1 0 0 1 5 0)"
                  fill="var(--color-secondary)"
                />
              </svg>
            </span>
          </div>

          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white">
              Track your shipment
            </h1>
            <p className="text-white/90 mt-3 max-w-2xl mx-auto">
              Enter your tracking ID to view real-time status, history, and
              estimated delivery times. You can also paste an ID from your email
              or recent orders.
            </p>
          </div>

          {/* centered search card */}
          <div className="max-w-3xl mx-auto">
            <form
              onSubmit={handleTrack}
              className="track-card relative mx-4 sm:mx-0"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <label className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    aria-label="Tracking ID"
                    placeholder="Enter tracking ID (e.g. X9TPLQ72MFD1)"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    onKeyDown={onKeyDown}
                    className="
                      pl-12 pr-4 py-3 w-full rounded-full bg-white text-gray-900 text-base font-medium border border-gray-200 shadow-sm
                      placeholder:text-gray-500 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[var(--color-secondary)] transition-colors"
                  />
                </label>

                <button
                  type="submit"
                  onClick={handleTrack}
                  className="group flex-none inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold shadow-md bg-[var(--color-secondary)] hover:bg-orange-600 text-white transition-all"
                  aria-label="Track shipment"
                  style={{ minWidth: 136 }}
                >
                  <span className="whitespace-nowrap">Track</span>
                  <ArrowUp className="transform transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>

              {/* helper row */}
              <div className="mt-3 flex items-center justify-between text-sm text-black/90">
                <div>
                  Example:{" "}
                  <span className="text-[var(--color-secondary)]">
                    X9TPLQ72MFD1
                  </span>
                </div>
                <div>
                  Need help?{" "}
                  <a className="underline" href="/contact">
                    Contact support
                  </a>
                </div>
              </div>

              {/* recent searches */}
              {recent.length > 0 && (
                <div className="mt-4">
                  <div className="text-sm text-white/80 mb-2">
                    Recent searches
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recent.map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => handleRecentClick(r)}
                        className="recent-chip inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/95 text-sm hover:bg-white/20 transition"
                      >
                        <span className="truncate max-w-[10rem]">{r}</span>
                      </button>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        try {
                          localStorage.removeItem(RECENT_KEY);
                        } catch {}
                        setRecent([]);
                      }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/06 text-white/80 text-sm hover:bg-white/12 transition"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Import rendered component goes below the top background area */}
      <main className="page-content">
        {/* Track results / instruction copy (optional) */}
        <section className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Quick tracking help
          </h2>
          <p className="mt-3 text-gray-700 max-w-3xl">
            If you don't have a tracking ID yet, check your order confirmation
            email or contact the sender. Tracking details appear on the
            dedicated tracking page after search.
          </p>
        </section>

        {/* HowItWorks is inserted here as requested */}
        <HowItWorks />
      </main>
    </div>
  );
}
