/**
 * Signed session cookie for the pre-Supabase access gate.
 *
 * The cohort roster is the allowlist and a shared access code proves the person was
 * actually given the link. Uses Web Crypto so the same code runs in middleware (edge)
 * and in server components.
 */
export const SESSION_COOKIE = "bb_session";

const encoder = new TextEncoder();

/**
 * "open"   — no gate: anyone with the link can read the site. Signing in is only
 *            needed to post or to edit your own profile. (Current default.)
 * "cohort" — anyone on the roster with the access code can get in; nothing is public
 * "admin"  — only ADMIN_EMAILS can get in, for setup
 */
export type AccessMode = "open" | "cohort" | "admin";

export function accessMode(): AccessMode {
  const mode = process.env.ACCESS_MODE;
  if (mode === "admin" || mode === "cohort") return mode;
  return "open";
}

export function accessCode(): string {
  return process.env.COHORT_ACCESS_CODE ?? "beer-and-books";
}

function secret(): string {
  return process.env.AUTH_SECRET ?? "development-only-secret-change-me";
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionValue(email: string): Promise<string> {
  const payload = email.toLowerCase();
  return `${payload}|${await sign(payload)}`;
}

/** Returns the signed-in email, or null when the cookie is missing or tampered with. */
export async function readSessionValue(raw: string | undefined): Promise<string | null> {
  if (!raw) return null;
  const separator = raw.lastIndexOf("|");
  if (separator < 1) return null;

  const payload = raw.slice(0, separator);
  const signature = raw.slice(separator + 1);
  const expected = await sign(payload);

  // Constant-time-ish comparison; lengths are fixed so an early exit leaks nothing useful.
  if (signature.length !== expected.length) return null;
  let mismatch = 0;
  for (let i = 0; i < signature.length; i++) {
    mismatch |= signature.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0 ? payload : null;
}
