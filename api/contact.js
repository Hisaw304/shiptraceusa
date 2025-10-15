// /api/contact.js (debug-friendly version)
import nodemailer from "nodemailer";

/**
 * Debug-friendly Vercel serverless contact endpoint.
 * - Set DEBUG_CONTACT=true (Vercel env) to see full error text in response while debugging.
 * - Remove/unset DEBUG_CONTACT in production.
 *
 * Expected env vars:
 *  - SMTP_HOST
 *  - SMTP_PORT
 *  - SMTP_USER
 *  - SMTP_PASS
 *  - CONTACT_TO_EMAIL (optional)
 */

const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const getIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
  req.socket?.remoteAddress ||
  "unknown";

const rateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10;

const checkRateLimit = (ip) => {
  const now = Date.now();
  const entry = rateMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_LIMIT_WINDOW_MS) {
    entry.count = 1;
    entry.start = now;
  } else {
    entry.count += 1;
  }
  rateMap.set(ip, entry);
  return entry.count <= RATE_LIMIT_MAX;
};

// Small helpers
function escapeHtml(unsafe = "") {
  return String(unsafe)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function nl2br(str) {
  return String(str).replace(/\n/g, "<br/>");
}

export default async function handler(req, res) {
  // top-level try/catch ensures we always return JSON (or a controlled text)
  try {
    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    // Defensive parse
    let body;
    try {
      body =
        typeof req.body === "string"
          ? JSON.parse(req.body || "{}")
          : req.body || {};
    } catch (err) {
      console.error("Failed to parse request body as JSON:", err);
      return res.status(400).json({ ok: false, error: "Invalid JSON body" });
    }

    const { name, email, subject, message, hp } = body || {};
    const ip = getIp(req);

    // Honeypot
    if (hp && String(hp).trim().length > 0) {
      console.log("Honeypot hit — silently accepting.");
      return res.status(200).json({ ok: true, spam: true });
    }

    // Rate limit
    if (!checkRateLimit(ip)) {
      console.warn("Rate limit exceeded for IP:", ip);
      return res.status(429).json({ ok: false, error: "Too many requests" });
    }

    // Validate
    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ ok: false, error: "Missing required fields" });
    }
    if (String(name).length > 250 || String(subject || "").length > 250) {
      return res.status(400).json({ ok: false, error: "Input too long" });
    }
    if (!VALID_EMAIL_RE.test(String(email))) {
      return res
        .status(400)
        .json({ ok: false, error: "Invalid email address" });
    }
    if (String(message).length > 5000) {
      return res.status(400).json({ ok: false, error: "Message too long" });
    }

    // Read env vars early and validate
    const host = process.env.SMTP_HOST;
    const port = parseInt(process.env.SMTP_PORT || "587", 10);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const toEmail = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;

    // Log which env var is missing (but never print SMTP_PASS)
    if (!host || !port || !user || !pass) {
      console.error("Missing SMTP configuration. Values present:", {
        SMTP_HOST: !!host,
        SMTP_PORT: !!process.env.SMTP_PORT,
        SMTP_USER: !!user,
        SMTP_PASS: !!pass,
      });
      return res
        .status(500)
        .json({ ok: false, error: "Mail server not configured" });
    }

    // Create transporter
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
      });
      // Note: transporter.verify() may hang on cold starts — run locally if needed
    } catch (err) {
      console.error("Error creating transporter:", err);
      // If DEBUG_CONTACT is true, include error text in response to help debugging
      if (process.env.DEBUG_CONTACT === "true") {
        return res.status(500).json({
          ok: false,
          error: "Failed creating transporter",
          details: String(err),
        });
      }
      return res
        .status(500)
        .json({ ok: false, error: "Failed creating transporter" });
    }

    // Build message
    const fromAddress = user;
    const html = `
      <h2>New contact form submission</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(
        subject || "Contact from site"
      )}</p>
      <p><strong>Message:</strong><br/>${nl2br(escapeHtml(message))}</p>
      <hr/>
      <p><small>IP: ${escapeHtml(ip)}</small></p>
      <p><small>User-Agent: ${escapeHtml(
        req.headers["user-agent"] || ""
      )}</small></p>
    `;

    const mailOptions = {
      from: `"ShipTraceUSA Website" <${fromAddress}>`,
      to: toEmail,
      // bcc: email, // optionally enable to send visitor a blind copy
      subject: `Website contact: ${subject || "New message"}`,
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${
        subject || "Contact from site"
      }\n\n${message}\n\nIP: ${ip}`,
      html,
    };

    // Log minimal request info for debugging (no message body)
    console.log("Sending contact email:", {
      to: toEmail,
      from: fromAddress,
      ip,
      name,
      email,
    });

    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({ ok: true, message: "Message sent" });
    } catch (err) {
      console.error("Error sending mail:", err);
      if (process.env.DEBUG_CONTACT === "true") {
        // careful: avoid exposing secrets — we only return the error text
        return res.status(500).json({
          ok: false,
          error: "Failed to send mail",
          details: String(err),
        });
      }
      return res.status(500).json({ ok: false, error: "Failed to send mail" });
    }
  } catch (err) {
    // catch any unexpected error and return JSON
    console.error("Unhandled exception in /api/contact:", err);
    if (process.env.DEBUG_CONTACT === "true") {
      return res.status(500).json({
        ok: false,
        error: "Unhandled server error",
        details: String(err),
      });
    }
    return res.status(500).json({ ok: false, error: "Internal server error" });
  }
}
