// Self-contained auth helpers for the mock API routes.
// Dependency-free: uses Node's built-in crypto (no jsonwebtoken/bcrypt needed).
import crypto from "node:crypto";

const SECRET = process.env.JWT_SECRET || "dev-secret-logistik-3100";
const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

const b64url = (input) => Buffer.from(input).toString("base64url");

// --- Token (compact HMAC-signed token, JWT-like) ---------------------------
export function signToken(payload) {
  const body = b64url(JSON.stringify({ ...payload, exp: Date.now() + TOKEN_TTL_MS }));
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;

  const expected = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  const sigBuf = Buffer.from(sig);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

// --- Password hashing (scrypt) ---------------------------------------------
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, hash] = stored.split(":");
  const calc = crypto.scryptSync(password, salt, 64);
  const hashBuf = Buffer.from(hash, "hex");
  return hashBuf.length === calc.length && crypto.timingSafeEqual(hashBuf, calc);
}

// --- Request helpers --------------------------------------------------------
export function getBearerToken(req) {
  const header = req.headers.get("authorization") || "";
  const [, token] = header.split(" ");
  return token || null;
}
