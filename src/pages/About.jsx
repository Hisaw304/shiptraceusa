// src/Pages/About.jsx
import React from "react";
import AboutUs from "../components/AboutUs"; // your existing component
import {
  ShieldCheck,
  Users,
  Lightbulb,
  RefreshCcw,
  CheckCircle,
  Award,
} from "lucide-react";
import heroImg from "../assets/about-hero.jpg"; // optional hero bg (place your image here)
import teamImg from "../assets/about-team1.jpg"; // optional image for the "Our People" block

export default function About() {
  return (
    <div className="about-page">
      {/* 1) Imported component — the component you built earlier (kept at top) */}
      <section aria-label="About summary">
        <AboutUs />
      </section>

      {/* 2) Company overview — not repeating the AboutUs heading verbatim */}
      <section
        className="company-overview relative py-16"
        style={{
          backgroundImage: heroImg ? `url(${heroImg})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="overlay absolute inset-0 bg-black/55" aria-hidden></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
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
              ABOUT OUR COMPANY
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

          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white">
              Company overview
            </h2>
            <p className="mt-3 text-white/90">
              ShipTraceUSA is a U.S.-focused logistics company dedicated to
              fast, reliable and visible deliveries across the country. We
              concentrate on domestic excellence — regional hubs, predictable
              transit windows, and real-time tracking so businesses and
              consumers can rely on every shipment.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="text-white/95">
              <h3 className="text-xl font-semibold mb-3">
                Built for the U.S. market
              </h3>
              <p className="mb-4 text-white/90">
                Our network of regional distribution centers and local partners
                allows us to offer flexible delivery options — same-day and
                next-day express services for many routes, scheduled regional
                deliveries, and scalable solutions for e-commerce and retail
                clients.
              </p>

              <p className="mb-4 text-white/90">
                We combine modern fleet operations with data-driven routing and
                a user-friendly tracking experience. ShipTraceUSA focuses on
                operational excellence, safety, and technology so you get
                predictable results every time.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--color-secondary)] text-white font-semibold hover:brightness-95 transition"
                >
                  Contact sales
                </a>
                <a
                  href="/services"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/14 text-white hover:bg-white/6 transition"
                >
                  Our services
                </a>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-lg bg-white/5 mx-auto max-w-sm">
              {teamImg ? (
                <img
                  src={teamImg}
                  alt="ShipTraceUSA team"
                  className="w-full h-64 object-cover"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-white/80 bg-[var(--color-accent)]">
                  <span>Team image placeholder</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3) Core values */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">
              Our core values
            </h2>
            <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
              Values that guide how we operate day-to-day and how we treat
              customers, partners and teammates.
            </p>
          </div>

          <div className="values-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Safety</h3>
              <p className="text-sm text-gray-600">
                Every delivery is handled with the highest safety standards —
                for people and cargo.
              </p>
            </article>

            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <Users size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Teamwork</h3>
              <p className="text-sm text-gray-600">
                We collaborate across teams and partners to deliver consistent
                outcomes.
              </p>
            </article>

            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <Lightbulb size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Innovation</h3>
              <p className="text-sm text-gray-600">
                We invest in software and hardware that improve visibility and
                speed.
              </p>
            </article>

            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <RefreshCcw size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Resilience</h3>
              <p className="text-sm text-gray-600">
                We adapt quickly to disruptions and keep your deliveries moving.
              </p>
            </article>

            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <CheckCircle size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Integrity</h3>
              <p className="text-sm text-gray-600">
                We do the right thing for our customers, partners, and team
                members.
              </p>
            </article>

            <article className="value-card p-6 rounded-xl shadow-sm bg-white">
              <div className="value-icon w-12 h-12 rounded-md flex items-center justify-center mb-3 border-2">
                <Award size={20} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Professionalism</h3>
              <p className="text-sm text-gray-600">
                Reliable service, responsive support, and clear communication —
                always.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 4) Vision & closing */}
      <section className="py-12 bg-[var(--color-accent)]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-extrabold mb-3 text-[var(--color-primary)]">
            Our vision
          </h3>
          <p className="text-gray-800 max-w-3xl mx-auto">
            To be the most trusted domestic logistics partner in the United
            States — delivering predictable, safe and transparent parcel
            movement that helps businesses and communities thrive.
          </p>

          <div className="mt-8">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[var(--color-secondary)] text-white font-semibold hover:bg-orange-600 transition"
            >
              Work with us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
