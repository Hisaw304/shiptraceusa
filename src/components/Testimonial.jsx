import React, { useEffect, useRef, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* Replace these with your actual testimonial images */
import t1 from "../assets/testi-1.jpg";
import t2 from "../assets/testi-2.jpg";
import t3 from "../assets/testi-3.jpg";
import t4 from "../assets/testi-4.jpg";
import t5 from "../assets/testi-5.jpg";

const TESTIMONIALS = [
  /* ... same data as before ... */
  {
    id: 1,
    image: t1,
    name: "Jessica Morgan",
    role: "E-commerce Manager",
    quote:
      "ShipTraceUSA kept our marketplace deliveries on time and our customers delighted — fast, reliable, stress-free.",
  },
  {
    id: 2,
    image: t2,
    name: "Daniel R.",
    role: "Retail Owner",
    quote:
      "Great communication and real-time tracking. Their local coverage made returns and pickups much easier.",
  },
  {
    id: 3,
    image: t3,
    name: "Monica H.",
    role: "Supply Chain Lead",
    quote:
      "Operationally excellent — fewer exceptions, faster resolutions and clear reporting.",
  },
  {
    id: 4,
    image: t4,
    name: "Evan P.",
    role: "Logistics Coordinator",
    quote:
      "Transparent pricing, dependable drivers, and really good customer service when we needed it.",
  },
  {
    id: 5,
    image: t5,
    name: "Claire S.",
    role: "Shop Owner",
    quote:
      "Flexible pickup options and fast delivery windows — our clients love it.",
  },
];

export default function Testimonials() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [slidesToShow, setSlidesToShow] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [visible, setVisible] = useState(false);
  const touchStartX = useRef(null);
  const touchDeltaX = useRef(0);

  const total = TESTIMONIALS.length;

  // compute slidesToShow based on window width (modern breakpoints)
  const computeSlides = useCallback(() => {
    const w = window.innerWidth;
    if (w < 640) return 1; // mobile
    if (w >= 640 && w < 1024) return Math.min(3, total); // medium: 3
    if (w >= 1024 && w < 1280) return Math.min(4, total); // large: 4
    return Math.min(5, total); // xlarge: 5 (or as many as you have)
  }, [total]);

  useEffect(() => {
    const onResize = () => setSlidesToShow(computeSlides());
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [computeSlides]);

  // IntersectionObserver: only autoplay when visible
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setVisible(entry.isIntersecting);
        });
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // autoplay
  useEffect(() => {
    if (!visible || isPaused) return;
    const id = setInterval(() => {
      setIndex((i) => {
        // advance by 1, but clamp so we don't overshoot the last full page
        const next = i + 1;
        const maxIndex = Math.max(0, total - slidesToShow);
        return next > maxIndex ? 0 : next;
      });
    }, 4500);
    return () => clearInterval(id);
  }, [visible, isPaused, total, slidesToShow]);

  // navigation helpers
  const prev = () =>
    setIndex((i) => {
      const maxIndex = Math.max(0, total - slidesToShow);
      return i <= 0 ? maxIndex : i - 1;
    });
  const next = () =>
    setIndex((i) => {
      const maxIndex = Math.max(0, total - slidesToShow);
      return i >= maxIndex ? 0 : i + 1;
    });

  // keep index in valid range if slidesToShow changes
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, total - slidesToShow)));
  }, [slidesToShow, total]);

  // touch handlers for swipe
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
    setIsPaused(true);
  };
  const onTouchMove = (e) => {
    if (touchStartX.current == null) return;
    const x = e.touches[0].clientX;
    touchDeltaX.current = x - touchStartX.current;
  };
  const onTouchEnd = () => {
    const threshold = 50;
    if (touchDeltaX.current > threshold) prev();
    else if (touchDeltaX.current < -threshold) next();
    touchStartX.current = null;
    touchDeltaX.current = 0;
    setIsPaused(false);
  };

  // keyboard nav when container focused
  const onKeyDown = (e) => {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  };

  // track transform calculation (no explicit width; children use flex-basis)
  const slideWidthPercent = 100 / slidesToShow;
  const trackStyle = {
    transform: `translateX(-${index * slideWidthPercent}%)`,
    transition: "transform 600ms cubic-bezier(.22,1,.36,1)",
  };

  return (
    <section
      ref={containerRef}
      className="max-w-7xl mx-auto px-6 py-16"
      aria-label="Testimonials"
    >
      {/* heading */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="shape shape-left" aria-hidden>
          <svg
            width="59"
            height="5"
            viewBox="0 0 59 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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
          TESTIMONIALS
        </span>

        <span className="shape shape-right" aria-hidden>
          <svg
            width="59"
            height="5"
            viewBox="0 0 59 5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
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

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          What clients say about us
        </h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Real feedback from customers who use ShipTraceUSA every day — honest,
          local, and practical experiences.
        </p>
      </div>

      {/* slider container */}
      <div
        className="testimonial-slider relative"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocus={() => setIsPaused(true)}
        onBlur={() => setIsPaused(false)}
        onKeyDown={onKeyDown}
      >
        {/* prev/next controls */}
        <button
          aria-label="Previous testimonial"
          className="hidden md:inline-flex absolute left-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md hover:bg-white"
          onClick={prev}
        >
          <ChevronLeft size={20} className="text-[var(--color-primary)]" />
        </button>

        <button
          aria-label="Next testimonial"
          className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/90 shadow-md hover:bg-white"
          onClick={next}
        >
          <ChevronRight size={20} className="text-[var(--color-primary)]" />
        </button>

        {/* track */}
        <div
          className="overflow-hidden"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div
            ref={trackRef}
            className="testimonial-track flex"
            style={trackStyle}
          >
            {TESTIMONIALS.map((t) => (
              <article
                key={t.id}
                className="testimonial-card p-6 bg-white rounded-2xl shadow-md flex flex-col"
                style={{ flex: `0 0 ${slideWidthPercent}%` }}
                tabIndex={0}
                aria-label={`Testimonial from ${t.name}`}
              >
                <div className="flex items-start gap-4">
                  <img
                    src={t.image}
                    alt={`${t.name} photo`}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[var(--color-primary)]"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>

                <p className="mt-4 text-gray-700 flex-1">“{t.quote}”</p>
              </article>
            ))}
          </div>
        </div>

        {/* dots */}
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: Math.max(1, total - slidesToShow + 1) }).map(
            (_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2 h-2 rounded-full ${
                  i === index ? "bg-[var(--color-primary)]" : "bg-gray-300"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
