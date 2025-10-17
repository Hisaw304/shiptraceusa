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

  // replace existing html/text with the code below

  const siteUrl = process.env.SITE_URL || "https://www.shiptraceusa.com";
  const logoUrl = `${siteUrl.replace(/\/$/, "")}/logo.png`; // public/logo.png

  const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>New contact — ShipTraceUSA</title>
  </head>
  <body style="margin:0;background:#faf9f6;color:#1f2937;font-family:system-ui,-apple-system,Segoe UI,Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf9f6;padding:28px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="660" style="max-width:660px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 30px rgba(16,24,40,0.06);">
            <!-- header -->
            <tr>
              <td style="padding:20px 24px 10px;background:linear-gradient(90deg,#6b21a8 0%, #8b3bd0 100%);">
                <table role="presentation" width="100%">
                  <tr>
                    <td valign="middle" style="vertical-align:middle;">
                      <img src="${logoUrl}" alt="ShipTraceUSA" width="120" style="display:block;border:0;outline:none;text-decoration:none;">
                    </td>
                    <td align="right" valign="middle" style="vertical-align:middle;color:#ffffff;font-weight:600;font-size:14px;">
                      New contact received
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- summary -->
            <tr>
              <td style="padding:20px 24px;">
                <h1 style="margin:0 0 10px;font-size:20px;color:#111827;">New message from the website</h1>
                <p style="margin:0 0 16px;color:#374151;font-size:14px;line-height:1.45;">
                  You received a new contact enquiry. Details are below — reply directly to the email to respond.
                </p>

                <!-- details card -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:14px 0 18px;border-radius:8px;background:#fff7ed;border:1px solid rgba(249,115,22,0.08);">
                  <tr>
                    <td style="padding:14px 16px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="font-size:13px;color:#6b21a8;font-weight:700;padding-bottom:6px;">From</td>
                          <td style="font-size:14px;color:#111827;font-weight:600;padding-bottom:6px;">${escapeHtml(
                            name
                          )}</td>
                        </tr>
                        <tr>
                          <td style="font-size:13px;color:#6b21a8;font-weight:700;padding-bottom:6px;">Email</td>
                          <td style="font-size:14px;color:#111827;padding-bottom:6px;"><a href="mailto:${escapeHtml(
                            email
                          )}" style="color:#6b21a8;text-decoration:none;">${escapeHtml(
    email
  )}</a></td>
                        </tr>
                        <tr>
                          <td style="font-size:13px;color:#6b21a8;font-weight:700;">Subject</td>
                          <td style="font-size:14px;color:#111827;">${escapeHtml(
                            subject || "Contact from site"
                          )}</td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- message -->
                <div style="padding:16px;border-radius:8px;background:#ffffff;border:1px solid #eef2ff;">
                  <p style="margin:0 0 8px;font-size:13px;color:#6b21a8;font-weight:700;">Message</p>
                  <div style="font-size:14px;color:#111827;line-height:1.6;">
                    ${nl2br(escapeHtml(message))}
                  </div>
                </div>

                <!-- action row -->
                <div style="margin-top:18px;display:flex;gap:12px;flex-wrap:wrap;">
                  <a href="mailto:${escapeHtml(
                    email
                  )}?subject=Re: ${encodeURIComponent(
    subject || "Your message to ShipTraceUSA"
  )}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:#6b21a8;color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">Reply to sender</a>
                  <a href="${siteUrl.replace(
                    /\/$/,
                    ""
                  )}" style="display:inline-block;padding:10px 14px;border-radius:10px;background:transparent;border:1px solid #e6e6ea;color:#374151;text-decoration:none;font-weight:600;font-size:14px;">Open site</a>
                </div>
              </td>
            </tr>

            <!-- footer -->
            <tr>
              <td style="padding:16px 24px;background:#fbfbfd;border-top:1px solid #f3f4f6;text-align:center;font-size:12px;color:#6b7280;">
                <div style="margin-bottom:6px;">ShipTraceUSA — Nationwide coverage</div>
                <div>
                  <a href="mailto:${escapeHtml(
                    process.env.SMTP_USER || "info@shiptraceusa.com"
                  )}" style="color:#6b21a8;text-decoration:none;">${escapeHtml(
    process.env.SMTP_USER || "info@shiptraceusa.com"
  )}</a>
                </div>
                <div style="margin-top:8px;font-size:11px;color:#9ca3af;">This message was generated from your website contact form.</div>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;

  // plain-text fallback (simple & readable)
  const text = `New contact form submission

Name: ${name}
Email: ${email}
Subject: ${subject || "Contact from site"}

Message:
${message}

Reply: ${"mailto:" + email}
Website: ${siteUrl}
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
