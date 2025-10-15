// /api/contact.js
import nodemailer from "nodemailer";

/**
 * Vercel Serverless function for sending contact emails using nodemailer.
 * Expected env vars:
 *  - SMTP_HOST (e.g. mail.privateemail.com)
 *  - SMTP_PORT (number, e.g. 587)
 *  - SMTP_USER (full email, e.g. info@shiptraceusa.com)
 *  - SMTP_PASS (password or app password)
 *  - CONTACT_TO_EMAIL (fallback recipient email)
 *
 * Keep secrets server-side (do NOT expose SMTP_PASS to client).
 */

const VALID_EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

const getIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")?.[0]?.trim() ||
  req.socket?.remoteAddress ||
  "unknown";

// Simple in-memory rate limiting per IP (ephemeral; resets on cold starts)
const rateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const RATE_LIMIT_MAX = 10; // max requests per window

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  // parse body (Vercel usually gives parsed JSON, but be defensive)
  const body =
    typeof req.body === "string"
      ? JSON.parse(req.body || "{}")
      : req.body || {};

  const { name, email, subject, message, hp } = body;
  const ip = getIp(req);

  // Honeypot: if filled => treat as spam (silently)
  if (hp && String(hp).trim().length > 0) {
    return res.status(200).json({ ok: true, spam: true, message: "OK" });
  }

  // Rate limit by IP
  if (!checkRateLimit(ip)) {
    return res
      .status(429)
      .json({ ok: false, error: "Too many requests, please wait." });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ ok: false, error: "Missing required fields." });
  }
  if (String(name).length > 250 || String(subject || "").length > 250) {
    return res.status(400).json({ ok: false, error: "Input too long." });
  }
  if (!VALID_EMAIL_RE.test(String(email))) {
    return res.status(400).json({ ok: false, error: "Invalid email address." });
  }
  if (String(message).length > 5000) {
    return res.status(400).json({ ok: false, error: "Message too long." });
  }

  // SMTP / environment setup
  const host = process.env.SMTP_HOST || "mail.privateemail.com";
  const port = parseInt(process.env.SMTP_PORT || "587", 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const toEmail = process.env.CONTACT_TO_EMAIL || "info@shiptraceusa.com";

  if (!host || !port || !user || !pass) {
    console.error("Missing SMTP config in environment");
    return res
      .status(500)
      .json({ ok: false, error: "Mail server not configured." });
  }

  // From address (use verified SMTP user) and replyTo for visitor replies
  const fromAddress = user;

  let transporter;
  try {
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465 (SSL), false for 587 (STARTTLS)
      auth: {
        user,
        pass,
      },
      // tls: { rejectUnauthorized: true } // enable if you need strict TLS checks
    });

    // NOTE: transporter.verify() can hang in serverless; use locally to test credentials.
    // await transporter.verify();
  } catch (err) {
    console.error("Failed creating transporter:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to initialize mailer." });
  }

  // Build message body
  const html = `
  <h2>New contact form submission</h2>
  <p><strong>Name:</strong> ${escapeHtml(name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  <p><strong>Subject:</strong> ${escapeHtml(subject || "Contact from site")}</p>
  <p><strong>Message:</strong><br/>${nl2br(escapeHtml(message))}</p>
  <hr/>
  <p><small>User-Agent: ${escapeHtml(
    req.headers["user-agent"] || ""
  )}</small></p>
`;

  const mailOptions = {
    from: `"ShipTraceUSA Website" <${fromAddress}>`,
    to: toEmail,
    // If you'd like the visitor to receive a blind copy, uncomment:
    // bcc: email,
    subject: `Website contact: ${subject || "New message"}`,
    replyTo: email, // reply will go to the visitor
    text: `Name: ${name}\nEmail: ${email}\nSubject: ${
      subject || "Contact from site"
    }\n\n${message}`,
    html,

    // optional envelope forcing (uncomment only if you encounter provider issues):
    // envelope: { from: fromAddress, to: toEmail }
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ ok: true, message: "Message sent." });
  } catch (err) {
    console.error("Error sending mail:", err);
    return res
      .status(500)
      .json({ ok: false, error: "Failed to send message." });
  }
}

// small helpers
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
