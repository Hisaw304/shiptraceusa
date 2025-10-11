import React from "react";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Package, Users, Award, UserPlus, MapPin } from "lucide-react";
import trustedBg from "../assets/forklift.png"; // replace with your image

const STATS = [
  {
    id: 1,
    Icon: Package,
    end: 5000,
    suffix: "+",
    label: "Completed deliveries",
  },
  { id: 2, Icon: Users, end: 4657, suffix: "", label: "Satisfied clients" },
  { id: 3, Icon: Award, end: 65, suffix: "", label: "Award winners" },
  { id: 4, Icon: UserPlus, end: 128, suffix: "+", label: "Team members" },
  {
    id: 5,
    Icon: MapPin,
    end: 1250342,
    suffix: " km",
    label: "Kilometers covered",
  },
];

export default function TrustedBanner() {
  const [ref, inView] = useInView({ threshold: 0.28, triggerOnce: true });

  return (
    <section
      ref={ref}
      className="trusted-banner mt-8 relative overflow-hidden py-16"
      aria-label="Trusted by thousands"
      style={{
        backgroundImage: `url(${trustedBg})`,
        backgroundPosition: "center",
        backgroundSize: "contain",
      }}
    >
      {/* dark overlay so text is readable */}
      <div className="absolute inset-0 bg-black/85" aria-hidden></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* small decorative label like previous sections */}
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
              <circle
                cx="56.5"
                cy="2.5"
                r="2.5"
                fill="var(--color-secondary)"
              />
            </svg>
          </span>

          <span className="uppercase text-sm font-semibold text-[var(--color-primary)]">
            TRUSTED
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

        {/* Heading / paragraph */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
            How we earn trust across the USA
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-white/90">
            We combine local knowledge with real-time visibility to deliver
            parcels quickly and reliably. Below are the results our operations
            have produced — real metrics from day-to-day deliveries.
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-stretch">
          {STATS.map(({ id, Icon, end, suffix, label }) => (
            <div
              key={id}
              className="stat-card group relative rounded-lg p-5 text-center bg-transparent"
              role="group"
            >
              {/* icon circle */}
              <div className="mx-auto">
                <div className="stat-circle inline-flex items-center justify-center w-16 h-16 rounded-full border-2">
                  <Icon className="stat-icon" size={24} />
                </div>
              </div>

              {/* number */}
              <div className="mt-4">
                <div className="stat-number text-2xl md:text-3xl font-extrabold text-white">
                  <CountUp
                    start={0}
                    end={inView ? end : 0}
                    duration={2.2}
                    separator=","
                    suffix={suffix}
                  />
                </div>
                <div className="mt-1 text-sm text-white/90">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* optional short CTA / paragraph under stats */}
        <div className="mt-10 text-center">
          <p className="text-white/80 max-w-3xl mx-auto">
            ShipTraceUSA is focused on operational excellence and transparency —
            we measure what matters and continuously improve our network to
            serve more communities across the country.
          </p>
        </div>
      </div>
    </section>
  );
}
