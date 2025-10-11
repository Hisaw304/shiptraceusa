import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, Search } from "lucide-react";

/**
 * FAQSection.jsx
 * - Accessible accordion (ARIA): each question is a button with aria-expanded + aria-controls
 * - Smooth height animation (JS-driven for reliable transitions)
 * - Search/filter box
 * - Expand all / Collapse all
 * - Keyboard navigation: Up/Down/Home/End + Enter/Space to toggle
 * - Persists open state to localStorage (key: shiptrace_faq_open)
 *
 * Usage: import FAQSection and render inside layout/page.
 */

const STORAGE_KEY = "shiptrace_faq_open_v1";

const FAQS = [
  {
    id: "faq-1",
    q: "How can I track my shipment?",
    a: `Enter your tracking ID in the site header or Track page. ShipTraceUSA provides live updates for each checkpoint — pickup, loading, transit and delivery. If you need help, contact support with your tracking ID.`,
  },
  {
    id: "faq-2",
    q: "Do you deliver across the entire USA?",
    a: `Yes. We cover the contiguous United States with regional hubs in major logistics centers. Use the map in the Contact section to view our hubs and service locations.`,
  },
  {
    id: "faq-3",
    q: "What does shipping cost and how do I get a quote?",
    a: `Costs depend on parcel size, weight, and speed. Use our quick quote tool on the Track page or contact our sales team for volume pricing and business accounts.`,
  },
  {
    id: "faq-4",
    q: "Can I change the delivery address after shipping?",
    a: `In many cases you can request a redirect before the parcel leaves the origin hub. Log in with your tracking ID or contact support immediately for assistance.`,
  },
  {
    id: "faq-5",
    q: "Do you offer insurance or declared value coverage?",
    a: `Yes — optional insurance (declared value) is available for valuable parcels. See the Terms for coverage limits and instructions on how to purchase protection when booking.`,
  },
  {
    id: "faq-6",
    q: "What are your return and pickup options?",
    a: `We provide drop-off, scheduled pickup, and pre-paid returns. Business accounts get volume pickup scheduling and integrated returns handling.`,
  },
  {
    id: "faq-7",
    q: "How long does a typical delivery take?",
    a: `Transit times depend on distance and chosen service (express vs economy). Domestic express typically 1–2 business days between major hubs; regional economy options are longer.`,
  },
  {
    id: "faq-8",
    q: "How can I contact support?",
    a: `Email info@shiptraceusa.com or use the Contact section. Have your tracking ID ready for faster support. We aim to respond within one business day.`,
  },
];

export default function FAQSection() {
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? new Set(JSON.parse(raw)) : new Set();
    } catch {
      return new Set();
    }
  });

  // refs to buttons + content panels for keyboard nav + measuring height
  const buttonRefs = useRef({});
  const panelRefs = useRef({});

  // generate filtered list
  const filtered = FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(query.trim().toLowerCase()) ||
      f.a.toLowerCase().includes(query.trim().toLowerCase())
  );

  // persist open ids when they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...openIds]));
    } catch {
      // ignore
    }
  }, [openIds]);

  // helper to set panel height for animation
  const openPanel = (id) => {
    const panel = panelRefs.current[id];
    if (!panel) return;
    const scrollH = panel.scrollHeight;
    panel.style.height = `${scrollH}px`;
    panel.setAttribute("data-open", "true");
    // after transition, set height to auto so it can grow if content changes
    const handler = () => {
      if (panel.getAttribute("data-open") === "true")
        panel.style.height = "auto";
      panel.removeEventListener("transitionend", handler);
    };
    panel.addEventListener("transitionend", handler);
  };

  const closePanel = (id) => {
    const panel = panelRefs.current[id];
    if (!panel) return;
    // set height to current pixel height then force reflow then set to 0 to animate
    const currentH = panel.scrollHeight;
    panel.style.height = `${currentH}px`;
    // force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    panel.offsetHeight;
    panel.style.height = "0px";
    panel.setAttribute("data-open", "false");
  };

  const toggle = (id) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // animate close
        closePanel(id);
      } else {
        next.add(id);
        // animate open
        openPanel(id);
      }
      return next;
    });
  };

  // reconcile DOM heights after the component mounts (open panels set to auto)
  useEffect(() => {
    // set initial heights for any panels that should be open
    filtered.forEach((f) => {
      const id = f.id;
      const panel = panelRefs.current[id];
      if (!panel) return;
      if (openIds.has(id)) {
        panel.style.height = `${panel.scrollHeight}px`;
        panel.setAttribute("data-open", "true");
        // after a tick, set to auto
        const t = setTimeout(() => {
          panel.style.height = "auto";
        }, 350);
        return () => clearTimeout(t);
      } else {
        panel.style.height = "0px";
        panel.setAttribute("data-open", "false");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [/* run when component mounts and when filter changes */ query]);

  // keyboard navigation
  const focusQuestionAt = (idx) => {
    const item = filtered[idx];
    if (!item) return;
    const btn = buttonRefs.current[item.id];
    if (btn) btn.focus();
  };

  const onBtnKeyDown = (e, idx, id) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      focusQuestionAt(Math.min(filtered.length - 1, idx + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      focusQuestionAt(Math.max(0, idx - 1));
    } else if (e.key === "Home") {
      e.preventDefault();
      focusQuestionAt(0);
    } else if (e.key === "End") {
      e.preventDefault();
      focusQuestionAt(filtered.length - 1);
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggle(id);
    }
  };

  const expandAll = () => {
    const all = new Set(filtered.map((f) => f.id));
    setOpenIds(all);
    // animate all opens
    filtered.forEach((f) => openPanel(f.id));
  };

  const collapseAll = () => {
    setOpenIds(new Set());
    filtered.forEach((f) => closePanel(f.id));
  };

  return (
    <section className="faq-section max-w-7xl mx-auto px-6 py-16">
      {/* header same treatment */}
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
          FAQ
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

      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
          Frequently asked questions
        </h2>
        <p className="mt-3 text-gray-700 max-w-3xl mx-auto">
          Answers to common questions about shipping, tracking and delivery with
          ShipTraceUSA.
        </p>
      </div>

      {/* controls */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3 items-stretch justify-between">
        <div className="flex-1 flex items-center gap-3">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              aria-label="Search FAQs"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mt-2 sm:mt-0">
          <button
            type="button"
            onClick={expandAll}
            className="px-4 py-2 rounded-md border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white transition"
          >
            Expand all
          </button>
          <button
            type="button"
            onClick={collapseAll}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-700 hover:bg-gray-100 transition"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* FAQ list */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            No results. Try different keywords.
          </div>
        )}

        {filtered.map((f, idx) => {
          const isOpen = openIds.has(f.id);
          return (
            <article
              key={f.id}
              className="faq-card bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <h3 className="m-0">
                <button
                  ref={(el) => (buttonRefs.current[f.id] = el)}
                  id={`faq-btn-${f.id}`}
                  aria-controls={`faq-panel-${f.id}`}
                  aria-expanded={isOpen}
                  onClick={() => toggle(f.id)}
                  onKeyDown={(e) => onBtnKeyDown(e, idx, f.id)}
                  className="faq-question w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-none"
                >
                  <span className="text-base font-medium text-gray-900">
                    {f.q}
                  </span>
                  <span
                    className={`transform transition-transform duration-200 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown
                      size={18}
                      className="text-[var(--color-primary)]"
                    />
                  </span>
                </button>
              </h3>

              <div
                id={`faq-panel-${f.id}`}
                ref={(el) => (panelRefs.current[f.id] = el)}
                role="region"
                aria-labelledby={`faq-btn-${f.id}`}
                className="faq-answer px-5 pt-0 pb-4 text-gray-700"
                style={{
                  height: isOpen ? "auto" : "0px",
                  overflow: "hidden",
                  transition: "height 320ms ease",
                }}
                // note: we also actively set heights in openPanel/closePanel for robust animated transitions
              >
                <div className="py-3">{f.a}</div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
