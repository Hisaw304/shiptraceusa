import React from "react";
import ContactSection from "../components/ContactSection"; // your existing form+map
// If you have local components for FAQ and Stats, import them here:

// Hero background image: drop your hero image in src/assets and update path if different
import heroContact from "../assets/office.jpg";

import TrustedBanner from "../components/TrustedBanner";
import FAQSection from "../components/FAQSection";

/**
 * ContactPage (updated)
 *
 * Structure:
 *  - Hero (bg image)
 *  - ContactSection (imported)  <-- this component has id="contact"
 *  - CTA (email-only + two buttons that scroll up to the contact form)
 *  - FAQ (imported component)
 *  - Stats (imported component)
 *
 * Notes:
 *  - If your ContactSection changes the id, update the scroll target below.
 *  - If you don't yet have FAQ/Stats components, either create them at the paths above
 *    or remove those imports and render placeholders.
 */

export default function ContactPage() {
  // scroll helper
  const scrollToContact = () => {
    const el = document.getElementById("contact");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      // focus the first field for accessibility
      const firstInput = el.querySelector(
        "input, textarea, button, [tabindex]"
      );
      if (firstInput) firstInput.focus({ preventScroll: true });
    } else {
      // fallback: go to top of page
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main>
      {/* HERO with background image */}
      <section
        className="contact-hero"
        style={{
          backgroundImage: `url(${heroContact})`,
        }}
        aria-hidden="false"
      >
        <div className="contact-hero-overlay" />
        <div className="container max-w-7xl mx-auto px-6 py-20">
          <div className="label-row mb-4">
            <span className="shape-left" aria-hidden />
            <span className="small-label uppercase ">CONTACT</span>
            <span className="shape-right" aria-hidden />
          </div>

          <h1 className="hero-h1">Contact ShipTraceUSA</h1>
          <p className="hero-lead max-w-3xl">
            Questions about tracking or pickups? Use the form below — our team
            replies quickly.
          </p>
        </div>
      </section>

      {/* MAIN: your ContactSection (form + map) */}
      <ContactSection />

      {/* CTA immediately after contact section
          - only email displayed (no phone)
          - buttons scroll up to the contact form
      */}
      <section className="container max-w-7xl mx-auto px-6 py-10">
        <div
          className="cta-immediate rounded-2xl p-8 bg-white border-2"
          style={{ borderColor: "var(--color-primary)" }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <div className="text-lg md:text-xl font-bold">
                Need help with a shipment?
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Email us at{" "}
                <a
                  className="text-[var(--color-primary)] underline"
                  href="mailto:support@shiptraceusa.com"
                >
                  support@shiptraceusa.com
                </a>
                {" — we'll reply as soon as possible."}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button onClick={scrollToContact} className="btn-primary">
                Open contact form
              </button>

              <button onClick={scrollToContact} className="btn-ghost">
                Report an issue
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Imported components (FAQ then Stats) */}
      {/* If you want to change order or omit one, just remove or move these imports above */}
      <section className="container max-w-7xl mx-auto px-6 py-10">
        {/* FAQ component — import from ../components/FAQ */}
        <div className="mb-8">
          <FAQSection />
        </div>

        {/* Stats component — import from ../components/Stats */}
        <div>
          <TrustedBanner />
        </div>
      </section>
    </main>
  );
}
