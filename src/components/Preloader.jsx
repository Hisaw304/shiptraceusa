import React, { useEffect, useState } from "react";

/**
 * Preloader (React + Tailwind)
 * - Default export component
 * - Uses your :root variables (does not re-declare them)
 * - Tailwind-first styling with a small injected stylesheet for keyframes
 * - Exposes props:
 *     visible (bool) - control show/hide from parent
 *     autoHideMs (number|null) - if number, auto-hides after that ms (default: 2200)
 *     variant: 'sheen' | 'type' - text animation style (default: 'sheen')
 *     onHidden() - callback when preloader is removed
 *
 * Usage:
 * 1) Put /public/logo.png in your public folder
 * 2) Paste this file to src/components/Preloader.jsx
 * 3) Import and render <Preloader visible={loading} onHidden={() => setLoading(false)} />
 */

export default function Preloader({
  visible = true,
  autoHideMs = 2200,
  variant = "sheen",
  onHidden,
}) {
  const [show, setShow] = useState(Boolean(visible));

  // inject keyframes and helper CSS once (scoped class names are used)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = "_stusa_preloader_styles";
    if (document.getElementById(id)) return;
    const css = `
      @keyframes stusa-ring-rotate { 0%{ transform: rotate(0deg); } 100%{ transform: rotate(360deg); } }
      @keyframes stusa-orb-roll { 0%{ transform: rotate(0deg) translateX(56px) rotate(0deg); } 100%{ transform: rotate(360deg) translateX(56px) rotate(-360deg); } }
      @keyframes stusa-text-pop { 0%{ transform: translateY(8px) scale(.98); opacity:0 } 60%{ transform: translateY(-4px) scale(1.02); opacity:1 } 100%{ transform: translateY(0) scale(1); }}
      @keyframes stusa-sheen { 0%{ background-position: 0% 50% } 100%{ background-position: 200% 50% }}

      /* small utility to respect reduced motion */
      @media (prefers-reduced-motion: reduce) {
        .stusa-anim { animation: none !important; }
      }

      /* makes the conic ring band look thin */
      .stusa-ring::before{ content: ''; position: absolute; inset: -6px; border-radius: 9999px; background: conic-gradient(from 90deg, var(--color-secondary), var(--color-primary), rgba(0,0,0,0.06)); mask: radial-gradient(farthest-side, transparent calc(100% - 12px), black calc(100% - 10px)); filter: drop-shadow(0 8px 18px rgba(107,33,168,0.10)); animation: stusa-ring-rotate 1.8s linear infinite; }
      .stusa-orb{ width: 16px; height: 16px; border-radius: 9999px; position: absolute; top: 8px; left: 50%; transform-origin: center; transform: translateX(-50%); animation: stusa-orb-roll 1.8s linear infinite; box-shadow: 0 8px 20px rgba(249,115,22,0.14); }
      .stusa-orb::after{ content: ''; position: absolute; inset: -8px; border-radius: 9999px; filter: blur(6px); opacity: 0.45; background: radial-gradient(circle at center, color-mix(in srgb, var(--color-secondary) 60%, white 15%), transparent 45%); }
      .stusa-brand::after{ content: ''; display:block; height:4px; border-radius:9999px; width:80%; margin:10px auto 0; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.7), transparent); background-size: 200% 100%; animation: stusa-sheen 1.6s linear infinite; opacity: 0.7; }
    `;
    const el = document.createElement("style");
    el.id = id;
    el.appendChild(document.createTextNode(css));
    document.head.appendChild(el);
  }, []);

  // respect visible prop
  useEffect(() => setShow(Boolean(visible)), [visible]);

  // auto-hide demo behaviour (but parent should control hide in production)
  useEffect(() => {
    if (!show) return;
    if (typeof autoHideMs !== "number" || autoHideMs <= 0) return;
    const t = setTimeout(() => {
      setShow(false);
      if (typeof onHidden === "function") onHidden();
    }, autoHideMs);
    return () => clearTimeout(t);
  }, [show, autoHideMs, onHidden]);

  if (!show) return null;

  // accessibility: status + polite live region
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading Ship Track USA"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[linear-gradient(180deg,rgba(224,242,254,0.24),rgba(255,255,255,0))] backdrop-blur-sm"
    >
      <div className="w-[min(380px,88vw)] p-6 rounded-2xl shadow-xl bg-white/90 flex flex-col items-center gap-4">
        <div className="relative w-36 h-36 flex items-center justify-center">
          {/* ring (pseudo implemented via injected CSS .stusa-ring::before) */}
          <span
            className="stusa-ring absolute inset-0 rounded-full"
            aria-hidden="true"
          ></span>

          {/* small orb that rolls */}
          <span
            className="stusa-orb"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg,var(--color-secondary),color-mix(in srgb,var(--color-secondary) 60%, black 6%))",
            }}
          />

          {/* centered logo */}
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-inner z-10 overflow-hidden">
            <img
              src="/logo.png"
              alt="Ship Track USA logo"
              className="w-11 h-11 object-contain"
            />
          </div>
        </div>

        <div className="text-center mt-1">
          {/* gradient clipped brand text */}
          <div
            className="stusa-brand font-semibold text-lg tracking-wide inline-block bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] stusa-anim"
            style={{
              animation: "stusa-text-pop .72s cubic-bezier(.2,.9,.2,1) both",
            }}
          >
            {/* Choose casing exactly as provided */}
            Ship Track Usa
          </div>

          <div className="mt-2 text-sm text-slate-600 flex items-center justify-center gap-3 opacity-90">
            {variant === "type" ? (
              <TypewriterText
                lines={["Tracking made simple", "Preparing your shipments"]}
              />
            ) : (
              <span className="text-xs">
                Tracking made simple • Preparing your shipments
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Lightweight typewriter component for the optional `variant='type'`.
 * Pure React, no deps. Respects prefers-reduced-motion.
 */
function TypewriterText({
  lines = ["Tracking made simple", "Preparing your shipments"],
  charDelay = 40,
  lineDelay = 600,
}) {
  const [idx, setIdx] = useState(0); // which line
  const [text, setText] = useState("");
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduce) {
      setText(lines[0] || "");
      return;
    }
    let mounted = true;
    let charTimer = null;

    function typeLine(line) {
      return new Promise((resolve) => {
        let i = 0;
        charTimer = setInterval(() => {
          if (!mounted) return resolve();
          i += 1;
          setText(line.slice(0, i));
          if (i >= line.length) {
            clearInterval(charTimer);
            resolve();
          }
        }, charDelay);
      });
    }

    async function run() {
      while (mounted) {
        await typeLine(lines[idx % lines.length]);
        await new Promise((r) => setTimeout(r, lineDelay));
        setIdx((s) => (s + 1) % lines.length);
      }
    }

    run();
    return () => {
      mounted = false;
      if (charTimer) clearInterval(charTimer);
    };
  }, [charDelay, lineDelay, lines, idx, reduce]);

  return <div className="text-xs">{text}</div>;
}
