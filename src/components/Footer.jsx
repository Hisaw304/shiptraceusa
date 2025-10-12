import React from "react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary)] text-white mt-16 pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-3 mb-3">
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
          </div>
          <p className="text-sm text-white/80">
            Real-time shipment tracking made simple and reliable.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="link-hover">
                Home
              </a>
            </li>
            <li>
              <a href="/track" className="link-hover">
                Track
              </a>
            </li>
            <li>
              <a href="/contact" className="link-hover">
                Contact
              </a>
            </li>
            <li>
              <a href="/about" className="link-hover">
                About
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Contact</h4>
          <p className="text-sm">info@shiptraceusa.com</p>
        </div>

        <div>
          <h4 className="font-semibold mb-3">Follow Us</h4>
          <div className="flex gap-3">
            <a href="#" className="p-2 bg-white/20 rounded hover:bg-white/30">
              <FaFacebookF />
            </a>
            <a href="#" className="p-2 bg-white/20 rounded hover:bg-white/30">
              <FaTwitter />
            </a>
            <a href="#" className="p-2 bg-white/20 rounded hover:bg-white/30">
              <FaLinkedinIn />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 mt-8 pt-4 text-center text-sm text-white/80">
        © {new Date().getFullYear()} ShipTraceUSA — All rights reserved.
      </div>
    </footer>
  );
}
