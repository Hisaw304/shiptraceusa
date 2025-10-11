import React, { useState } from "react";
import { FiMenu, FiX, FiHome, FiSearch, FiMail, FiInfo } from "react-icons/fi";
import { Link } from "react-router-dom";

const NAV_LINKS = [
  { name: "Home", href: "/", Icon: FiHome },
  { name: "Track", href: "/track", Icon: FiSearch },
  { name: "Contact", href: "/contact", Icon: FiMail },
  { name: "About", href: "/about", Icon: FiInfo },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-[var(--color-primary)] text-white sticky top-0 z-2000 shadow-md">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-3 group">
              {/* Logo */}
              <img
                src="/logo.png"
                alt="ShipTraceUSA Logo"
                className="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-105"
              />

              {/* Brand name */}
              <h1 className="text-lg font-semibold text-white group-hover:text-[var(--color-secondary)] transition-colors duration-300">
                ShipTraceUSA
              </h1>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {NAV_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                className="link-hover flex items-center gap-2 text-sm font-medium"
              >
                <Icon size={16} />
                {name}
              </a>
            ))}
            <a
              href="/track"
              className="btn-orange px-4 py-2 rounded-md text-sm ml-2"
            >
              Track Now
            </a>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mobile-animate bg-[var(--color-primary)] text-white border-t border-white/10">
          <div className="px-4 py-3 space-y-3">
            {NAV_LINKS.map(({ name, href, Icon }) => (
              <a
                key={name}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 py-2 text-sm font-medium hover:underline"
              >
                <Icon size={16} /> {name}
              </a>
            ))}
            <a
              href="/track"
              onClick={() => setOpen(false)}
              className="block text-center py-2 rounded-md btn-orange"
            >
              Track Now
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
