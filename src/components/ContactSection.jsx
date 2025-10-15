import React, { useRef, useState, useEffect } from "react";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useInView } from "react-intersection-observer";
import toast from "react-hot-toast";
import { MapPin, Mail } from "lucide-react";

/*
  ContactSection (ShipTraceUSA) - Updated to use a server-side API (/api/contact)
  - Removed EmailJS client usage
  - Posts form data to /api/contact (Vercel serverless function or similar)
  - Keeps honeypot spam protection and client-side validation
  - Keeps lazy/in-view map logic
*/

const LOCATIONS = [
  { id: "ny", label: "New York, NY", coords: [40.7128, -74.006] },
  { id: "la", label: "Los Angeles, CA", coords: [34.0522, -118.2437] },
  { id: "chi", label: "Chicago, IL", coords: [41.8781, -87.6298] },
  { id: "hou", label: "Houston, TX", coords: [29.7604, -95.3698] },
  { id: "mia", label: "Miami, FL", coords: [25.7617, -80.1918] },
  { id: "atl", label: "Atlanta, GA", coords: [33.749, -84.388] },
  { id: "dal", label: "Dallas, TX", coords: [32.7767, -96.797] },
  { id: "sf", label: "San Francisco, CA", coords: [37.7749, -122.4194] },
  { id: "sea", label: "Seattle, WA", coords: [47.6062, -122.3321] },
  { id: "den", label: "Denver, CO", coords: [39.7392, -104.9903] },
  { id: "phx", label: "Phoenix, AZ", coords: [33.4484, -112.074] },
  { id: "bos", label: "Boston, MA", coords: [42.3601, -71.0589] },
  { id: "phl", label: "Philadelphia, PA", coords: [39.9526, -75.1652] },
  { id: "det", label: "Detroit, MI", coords: [42.3314, -83.0458] },
  { id: "min", label: "Minneapolis, MN", coords: [44.9778, -93.265] },
  { id: "las", label: "Las Vegas, NV", coords: [36.1699, -115.1398] },
  { id: "slc", label: "Salt Lake City, UT", coords: [40.7608, -111.891] },
  { id: "cha", label: "Charlotte, NC", coords: [35.2271, -80.8431] },
  { id: "orl", label: "Orlando, FL", coords: [28.5383, -81.3792] },
  { id: "por", label: "Portland, OR", coords: [45.5152, -122.6784] },
];

const customIcon = L.divIcon({
  html: `
    <div style="
      background: var(--color-secondary);
      color: white;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      box-shadow: 0 0 10px rgba(0,0,0,0.3);
      transition: all 0.3s ease;
    ">
      <svg xmlns='http://www.w3.org/2000/svg' width='22' height='22' fill='currentColor' viewBox='0 0 24 24'>
        <path d='M12 2C8.1 2 5 5.1 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-3.9-3.1-7-7-7zm0 9.5c-1.4 0-2.5-1.1-2.5-2.5S10.6 6.5 12 6.5s2.5 1.1 2.5 2.5S13.4 11.5 12 11.5z'/>
      </svg>
    </div>
  `,
  className: "custom-location-icon",
  iconSize: [38, 38],
  iconAnchor: [19, 38],
  popupAnchor: [0, -38],
});

export default function ContactSection() {
  // NOTE: keep CONTACT_TO_EMAIL as a client-side VITE_ var only for the mailto fallback
  const TO_EMAIL =
    import.meta.env.VITE_CONTACT_TO_EMAIL || "info@shiptraceusa.com";

  const formRef = useRef(null);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    hp: "",
  }); // hp = honeypot
  const [mapActive, setMapActive] = useState(false);

  // Lazy-load map only when in view
  const [mapRef, inView] = useInView({ threshold: 0.15, triggerOnce: true });
  useEffect(() => {
    if (inView) setMapActive(true);
  }, [inView]);

  // read CSS vars for marker styling (fallback to hex)
  const [markerColors, setMarkerColors] = useState({
    border: "#6B21A8",
    fill: "#F97316",
    bg: "#E0F2FE",
  });
  useEffect(() => {
    try {
      const s = getComputedStyle(document.documentElement);
      const primary = s.getPropertyValue("--color-primary").trim() || "#6B21A8";
      const secondary =
        s.getPropertyValue("--color-secondary").trim() || "#F97316";
      const accent = s.getPropertyValue("--color-accent").trim() || "#E0F2FE";
      setMarkerColors({ border: primary, fill: secondary, bg: accent });
    } catch {
      /* ignore (fallback already set) */
    }
  }, []);

  // safe submit: spam check via honeypot
  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // Submit: POST to your serverless endpoint (/api/contact). Keep server-side secrets out of client.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.hp) {
      console.warn("Honeypot filled — aborting.");
      return;
    }
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill your name, email, and message.");
      return;
    }

    setSending(true);

    try {
      const resp = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          subject: form.subject,
          message: form.message,
          hp: form.hp,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        console.error("Contact API error:", data);
        toast.error(data?.error || "Failed to send message. Try again later.");
      } else {
        // api returns { ok: true } or { ok: true, spam: true }
        if (data.spam) {
          // gracefully pretend success to avoid giving bots feedback
          toast.success("Message sent — thanks!");
        } else {
          toast.success("Message sent — thanks! We'll reply shortly.");
        }
        setForm({ name: "", email: "", subject: "", message: "", hp: "" });
        formRef.current?.reset?.();
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      toast.error("Failed to send message. Try again later.");
    } finally {
      setSending(false);
    }
  };

  const MAP_CENTER = [39.8283, -98.5795];

  return (
    <section className="contact-section relative py-16" id="contact">
      {/* Heading (same look as other sections) */}
      <div className="flex items-center justify-center gap-3 mb-4">
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
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--color-secondary)" />
          </svg>
        </span>

        <span className="uppercase text-sm font-semibold text-[var(--color-primary)]">
          CONTACT US
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

      <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--color-primary)] text-center mb-2">
        Get in touch with ShipTraceUSA
      </h2>
      <p className="text-center text-gray-700 max-w-3xl mx-auto mb-8">
        Questions about shipping, rates, or integrating tracking? Send a message
        — or see our network below.
      </p>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* FORM */}
        <div className="contact-form-card bg-white rounded-lg shadow-lg p-6">
          <form ref={formRef} onSubmit={handleSubmit} noValidate>
            {/* name/email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="input-floating">
                <input
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <span>Your name</span>
              </label>

              <label className="input-floating">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder=" "
                  required
                />
                <span>Email address</span>
              </label>
            </div>

            {/* subject */}
            <label className="input-floating mt-4">
              <input
                name="subject"
                type="text"
                value={form.subject}
                onChange={handleChange}
                placeholder=" "
              />
              <span>Subject</span>
            </label>

            {/* message */}
            <label className="input-floating mt-4 textarea">
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder=" "
                rows={6}
                required
              />
              <span>Your message</span>
            </label>

            {/* honeypot (visually hidden) */}
            <input
              name="hp"
              type="text"
              value={form.hp}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
              style={{
                position: "absolute",
                left: "-9999px",
                top: "auto",
                width: "1px",
                height: "1px",
                overflow: "hidden",
              }}
              aria-hidden="true"
            />

            <div className="mt-4 flex items-center gap-4">
              <button
                type="submit"
                disabled={sending}
                className={`btn-orange inline-flex items-center gap-3 px-5 py-3 rounded-full font-semibold text-white ${
                  sending
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:brightness-95"
                }`}
              >
                {sending ? "Sending..." : "Send message"}
              </button>

              <div className="text-sm text-gray-600">
                Or email us at{" "}
                <a
                  className="underline text-[var(--color-primary)]"
                  href={`mailto:${TO_EMAIL}`}
                >
                  {TO_EMAIL}
                </a>
              </div>
            </div>
          </form>
        </div>

        {/* MAP (lazy loaded when in view) */}
        <div
          ref={mapRef}
          className="map-card relative rounded-lg overflow-hidden h-96 shadow-lg"
        >
          {mapActive ? (
            <MapContainer
              center={MAP_CENTER}
              zoom={4}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {LOCATIONS.map((loc) => (
                <Marker key={loc.id} position={loc.coords} icon={customIcon}>
                  <Popup>
                    <strong>{loc.label}</strong>
                    <div className="text-sm">ShipTraceUSA service hub</div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            // placeholder skeleton while map not loaded
            <div className="h-full flex items-center justify-center bg-[var(--color-accent)]">
              <div className="text-center">
                <MapPin
                  size={28}
                  className="mx-auto text-[var(--color-secondary)]"
                />
                <div className="mt-2 text-sm text-gray-700">Map loading…</div>
              </div>
            </div>
          )}

          {/* floating contact details */}
          <div className="map-floating p-3 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-[var(--color-primary)]">
              <MapPin /> <span>Nationwide coverage</span>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2">
              <Mail className="text-[var(--color-secondary)]" />{" "}
              <a className="underline" href={`mailto:${TO_EMAIL}`}>
                {TO_EMAIL}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm mt-2 text-gray-700"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
