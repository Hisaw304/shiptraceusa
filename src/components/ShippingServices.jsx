import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plane, Truck, Anchor, Package, Warehouse } from "lucide-react";
import serviceAir from "../assets/service-air.jpg";
import serviceRoad from "../assets/service-road.jpg";
import serviceOcean from "../assets/service-ocean.jpg";
import serviceWarehousing from "../assets/service-warehousing.jpg";
import serviceParcel from "../assets/service-parcel.jpg";

/*
  ShippingServices.jsx
  - Responsive grid of service cards
  - Each card: image (lazy + fade-in), icon-in-circle (purple border + orange icon), title, paragraph, "Read more" button
  - Header uses the same left/right shape treatment as your other sections
  - Buttons are orange, icons turn white on hover, circle bg turns purple on hover
*/

const SERVICES = [
  {
    id: "air",
    title: "Air Delivery",
    desc: "Fast, reliable air transport across the USA — ideal for urgent parcels and time-sensitive freight.",
    image: serviceAir,
    icon: Plane,
    href: "/services/air-delivery",
  },
  {
    id: "road",
    title: "Road Delivery",
    desc: "Extensive ground network for door-to-door and scheduled routes.",
    image: serviceRoad,
    icon: Truck,
    href: "/services/road-delivery",
  },
  {
    id: "ocean",
    title: "Ocean Delivery",
    desc: "Bulk transport and large shipments managed with care — port-to-port handling that stays within domestic coastal routes.",
    image: serviceOcean,
    icon: Anchor,
    href: "/services/ocean-delivery",
  },
  {
    id: "warehousing",
    title: "Fulfillment & Warehousing",
    desc: "Secure storage, pick & pack, and last-mile integration for e-commerce sellers.",
    image: serviceWarehousing,
    icon: Warehouse,
    href: "/services/fulfillment",
  },
  {
    id: "parcel",
    title: "Parcel Solutions",
    desc: "Flexible parcel options — drop-off, scheduled pickup and reverse logistics.",
    image: serviceParcel,
    icon: Package,
    href: "/services/parcel-solutions",
  },
];

export default function ShippingServices() {
  const navigate = useNavigate();

  // track which images have loaded so we can fade them in cleanly
  const [loaded, setLoaded] = useState({});

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
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
            <circle cx="56.5" cy="2.5" r="2.5" fill="var(--color-secondary)" />
          </svg>
        </span>

        <span className="uppercase text-sm font-semibold text-[var(--color-primary)]">
          SHIPPING SERVICES
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

      {/* heading + sub */}
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Specialist Logistics Services
        </h2>
        <p className="mt-4 max-w-3xl mx-auto text-gray-700">
          Tailored domestic solutions across road, air and sea — structured
          around visibility, speed and predictable delivery performance.
        </p>
      </div>

      {/* services grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {SERVICES.map((s) => {
          const Icon = s.icon;
          return (
            <article
              key={s.id}
              className="service-card group bg-white rounded-lg overflow-hidden shadow-sm flex flex-col"
              aria-labelledby={`svc-${s.id}-title`}
            >
              {/* image area */}
              <div className="service__img h-44 md:h-52 w-full bg-[var(--color-accent)]">
                <img
                  src={s.image}
                  alt={s.title}
                  decoding="async"
                  loading="lazy"
                  className={`w-full h-full object-cover transition-opacity duration-700 ${
                    loaded[s.id] ? "opacity-100" : "opacity-0"
                  }`}
                  onLoad={() => setLoaded((p) => ({ ...p, [s.id]: true }))}
                />
                {/* icon overlay in top-left (or center) */}
                <div className="service__img-icon absolute top-4 left-4">
                  <div className="service-circle w-12 h-12 rounded-full flex items-center justify-center border-2">
                    <Icon className="service-icon" size={20} />
                  </div>
                </div>
              </div>

              {/* content */}
              <div className="p-5 flex-1 flex flex-col">
                <h3
                  id={`svc-${s.id}-title`}
                  className="text-lg font-semibold text-gray-900 mb-2"
                >
                  {s.title}
                </h3>
                <p className="text-sm text-gray-700 mb-4 flex-1">{s.desc}</p>

                <div className="mt-2">
                  <button
                    onClick={() => navigate(s.href)}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[var(--color-secondary)] text-white font-semibold hover:bg-orange-600 transition"
                    aria-label={`Read more about ${s.title}`}
                  >
                    Read more
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden
                    >
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
