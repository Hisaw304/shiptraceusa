// /api/login.js
// Vercel-style serverless function (Node). Stores credentials only in server env vars.
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res.status(400).json({ error: "Missing username or password" });
    }

    const ADMIN_USER = process.env.ADMIN_USERNAME;
    const ADMIN_PASS = process.env.ADMIN_PASSWORD;

    if (!ADMIN_USER || !ADMIN_PASS) {
      // safe message, do not leak secrets
      return res.status(500).json({ error: "Server misconfiguration" });
    }

    // Basic compare (for production prefer hashed passwords + timing-safe compare)
    const ok = username === ADMIN_USER && password === ADMIN_PASS;

    if (!ok) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Success — return minimal user payload (don't return secrets)
    const user = { username: ADMIN_USER, role: "admin" };

    // Optionally: set httpOnly cookie here for session (recommended for production)
    // res.setHeader('Set-Cookie', `session=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=3600`);

    return res.status(200).json({ ok: true, user });
  } catch (err) {
    console.error("Login error", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
