/**
 * Centralized access to environment variables and secrets.
 *
 * Security-critical secrets MUST be read only through these helpers. A missing
 * value fails loudly (throws) instead of silently falling back to a known/default
 * value. Never add an insecure fallback in this file.
 */

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable: ${name}. Refusing to continue with an insecure default.`
    );
  }
  return value;
}

let _jwtKey: Uint8Array | null = null;

/** HS256 signing/verification key derived from JWT_SECRET. Throws if JWT_SECRET is unset. */
export function getJwtSecretKey(): Uint8Array {
  if (!_jwtKey) {
    _jwtKey = new TextEncoder().encode(requireEnv("JWT_SECRET"));
  }
  return _jwtKey;
}

/** Shared secret authenticating Vercel cron / internal calls. Throws if unset. */
export function getCronSecret(): string {
  return requireEnv("CRON_SECRET");
}

/** Stripe secret API key. Throws if unset. */
export function getStripeSecretKey(): string {
  return requireEnv("STRIPE_SECRET_KEY");
}

/** Stripe webhook signing secret. Throws if unset. */
export function getStripeWebhookSecret(): string {
  return requireEnv("STRIPE_WEBHOOK_SECRET");
}

/**
 * Constant-time string comparison, to avoid leaking secret length/content via
 * response-timing. Returns false on length mismatch.
 */
export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}
