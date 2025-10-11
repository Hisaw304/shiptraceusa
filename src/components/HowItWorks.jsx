import React from "react";
import { FileText, Package, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* Inline icons retained: Forklift + TwoPeopleExchange from before (kept small & semantic) */
function ForkliftIcon(props) {
  return (
    <svg
      width={props.size || 28}
      height={props.size || 28}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path
        d="M3 3h8v6H3V3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 9h4l2 4v5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM18 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
        fill="currentColor"
      />
      <path
        d="M16 6v2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TwoPeopleExchangeIcon(props) {
  return (
    <svg
      width={props.size || 28}
      height={props.size || 28}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      className={props.className}
    >
      <path d="M7 11a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
      <path d="M16 11a2 2 0 11-4 0 2 2 0 014 0z" fill="currentColor" />
      <path
        d="M3 18c1.5-2 4-3 7-3s5.5 1 7 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 18v-2l4-1"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M20 15l-2 0 0 3"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const STEPS = [
  {
    id: 1,
    Icon: FileText,
    title: "Parcel Register",
    desc: "Register parcels quickly online or at any ShipTraceUSA center. Securely attach recipient info and delivery preferences.",
  },
  {
    id: 2,
    Icon: ForkliftIcon,
    title: "Parcel Loading",
    desc: "We inspect, sort and load parcels with care—our experienced crew secures every package for safe transit.",
  },
  {
    id: 3,
    Icon: Truck,
    title: "Parcel In-Transit",
    desc: "Shipments move through optimized routes with live tracking — you’ll know location updates at every stage.",
  },
  {
    id: 4,
    Icon: TwoPeopleExchangeIcon,
    title: "Parcel Delivery",
    desc: "Final-mile delivery executed by trusted couriers. Delivery confirmation and proof of drop-off included.",
  },
];

export default function HowItWorks() {
  const navigate = useNavigate();

  return (
    <section className="how-works-section bg-white mt-8 max-w-7xl mx-auto px-6 py-16">
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
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--color-secondary)" />
          </svg>
        </span>

        <span className="uppercase text-sm font-semibold text-[var(--color-primary)]">
          HOW IT WORKS
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

      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          How We Deliver <br className="hidden md:inline" /> Your Parcel
        </h2>
        <p className="mt-4 text-gray-700 max-w-3xl mx-auto">
          ShipTraceUSA focuses on reliable, domestic shipping. From registration
          and safe loading, to in-transit tracking and final delivery—our
          process keeps your parcel visible and secure at every step.
        </p>
      </div>

      {/* Grid: mobile 1 col, sm 2 cols, lg: 2 cols but we position items to get 1&3 top, 2&4 bottom */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
        {STEPS.map((step) => {
          const { id, Icon, title, desc } = step;
          const numberText = id.toString().padStart(2, "0");

          // position & drop for 2 & 4 on large screens
          let lgPos = "";
          if (id === 1) lgPos = "lg:col-start-1 lg:row-start-1";
          if (id === 2)
            lgPos = "lg:col-start-1 lg:row-start-2 lg:translate-y-6";
          if (id === 3) lgPos = "lg:col-start-2 lg:row-start-1";
          if (id === 4)
            lgPos = "lg:col-start-2 lg:row-start-2 lg:translate-y-6";

          return (
            <article
              key={id}
              className={`how-step group relative ${lgPos} transform transition-all duration-300`}
              aria-labelledby={`how-step-${id}`}
            >
              {/* CARD */}
              <div
                className="card relative bg-white rounded-2xl pt-12 pb-6 px-6 border-2"
                style={{ borderColor: "var(--color-primary)" }}
              >
                {/* Circle icon overlapping top (center) */}
                <div className="absolute left-1/2 -translate-x-1/2 -top-10">
                  <div
                    className="step-circle w-20 h-20 rounded-full flex items-center justify-center border-2"
                    style={{
                      borderColor: "var(--color-primary)",
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-secondary)",
                    }}
                    aria-hidden
                  >
                    <Icon className="step-icon" size={32} />
                  </div>

                  {/* number badge — sits slightly bottom-right of circle */}
                  <div className="step-number -mt-2 -ml-3" aria-hidden>
                    <span className="text-sm font-semibold">{numberText}</span>
                  </div>
                </div>

                {/* Title & paragraph below the circle */}
                <div className="mt-8 text-center">
                  <h3
                    id={`how-step-${id}`}
                    className="text-lg font-semibold text-gray-900 mb-2"
                  >
                    {title}
                  </h3>
                  <p className="text-sm text-gray-700">{desc}</p>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={() => navigate("/how-it-works")}
          className="inline-block px-6 py-2 rounded-md bg-[var(--color-secondary)] text-white font-semibold hover:bg-orange-600 transition"
        >
          Learn more
        </button>
      </div>
    </section>
  );
}
