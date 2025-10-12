import React, { useEffect, useState } from "react";
import { Package, RefreshCcw, Clock, AlertCircle, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";

/* Replace these with your real images in /src/assets */
import about1 from "../assets/about 1.jpg";
import about2 from "../assets/about 2.jpg";
import about3 from "../assets/about 3.jpg";

const FEATURES = [
  {
    icon: Package,
    title: "Drop-off Service",
    desc: "Convenient local drop-off points across the United States.",
  },
  {
    icon: RefreshCcw,
    title: "Redirect Delivery",
    desc: "Change delivery addresses quickly before dispatch.",
  },
  {
    icon: Clock,
    title: "Pickup & Hours",
    desc: "Find pickup windows and center hours near you.",
  },
  {
    icon: AlertCircle,
    title: "Service Alerts",
    desc: "Real-time notifications about delays or route changes.",
  },
  {
    icon: Truck,
    title: "Returns & Reverse Logistics",
    desc: "Simple, trackable returns with pre-paid labels when needed.",
  },
];

export default function AboutUs() {
  const navigate = useNavigate();
  const images = [about1, about2, about3];

  // image rotation
  const [imgIndex, setImgIndex] = useState(0);
  const [imgLoaded, setImgLoaded] = useState(false);

  // preload all images once
  useEffect(() => {
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [images]);

  // when index changes, reset loaded state and load the next image
  useEffect(() => {
    setImgLoaded(false);
    const img = new Image();
    img.src = images[imgIndex];
    img.onload = () => setImgLoaded(true);

    const t = setInterval(() => {
      setImgIndex((i) => (i + 1) % images.length);
    }, 6000);

    return () => clearInterval(t);
  }, [imgIndex, images]);

  return (
    <section className="max-w-7xl bg-white mx-auto px-6 py-16">
      {/* small decorative heading with left/right shapes */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <span className="shape shape-left" aria-hidden>
          {/* left shape SVG - fill uses CSS var(--color-secondary) */}
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
          WE SPECIALIZE IN DOMESTIC TRANSPORTATION
        </span>

        <span className="shape shape-right" aria-hidden>
          {/* right shape SVG - mirrored */}
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

      {/* NEW: H2 directly under the small label + a short lead paragraph */}
      <div className="text-center mb-8">
        <h2
          id="about-heading"
          className="text-2xl md:text-3xl font-extrabold mb-3 text-gray-900"
        >
          About ShipTraceUSA
        </h2>
        <p className="text-gray-700 max-w-2xl mx-auto">
          We handle domestic shipments with a focus on speed, transparency, and
          customer care. Our network delivers across urban and rural routes with
          real-time tracking and dedicated support.
        </p>
      </div>

      {/* CARDS at the top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-10">
        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
          <article
            key={i}
            className="group about-card p-4 rounded-lg shadow-sm transform hover:-translate-y-1 transition-all duration-200 bg-[var(--color-accent)] hover:bg-[var(--color-primary)] text-gray-900 hover:text-white"
          >
            <div className="flex items-start gap-3">
              <div className="w-11 h-11 rounded-md flex items-center justify-center text-[var(--color-primary)] group-hover:text-white transition-colors">
                <Icon size={20} />
              </div>

              <div>
                <h3 className="text-sm font-semibold">{title}</h3>
                <p className="mt-1 text-sm text-gray-700 group-hover:text-white/90">
                  {desc}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Paragraph (left) + Image (right) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <p className="text-gray-700 mb-6">
            ShipTraceUSA specializes in dependable domestic shipping across the
            United States. Our logistics professionals secure competitive
            carrier options for ground and air, optimize transit times, and
            provide real-time visibility for every shipment. We build personal
            connections with customers to understand unique needs and go the
            extra mile — delivering reliable service founded on operational
            excellence and quick problem-solving.
          </p>

          {/* Button stays under paragraph on mobile (DOM order ensures that) */}
          <div className="mt-4">
            <button
              onClick={() => navigate("/about")}
              className="inline-block px-5 py-2 rounded-md font-semibold text-white bg-[var(--color-secondary)] hover:bg-orange-600 transition"
            >
              Learn more
            </button>
          </div>
        </div>

        {/* Image panel */}
        <div className="relative w-full bg-white h-72 md:h-96 rounded-lg overflow-hidden about-image-bg">
          {/* background uses --color-accent so user doesn't see gray while loading */}
          <img
            src={images[imgIndex]}
            alt={`ShipTraceUSA ${imgIndex + 1}`}
            className={`w-full h-full bg-white mx-auto max-w-sm object-contain transform transition-opacity duration-700 ease-in-out ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
          />

          {/* pagination dots */}
          <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2 z-20">
            {images.map((_, ii) => (
              <button
                key={ii}
                onClick={() => setImgIndex(ii)}
                className={`w-2 h-2 rounded-full transition ${
                  ii === imgIndex ? "bg-[var(--color-primary)]" : "bg-white/60"
                }`}
                aria-label={`Show image ${ii + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
