import crypto from "node:crypto";

export type RemovePayload = { id: string; ts: number };

const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000; // removal links work for 180 days

const secret = () => process.env.REVIEW_APPROVE_SECRET || "";
const b64 = (s: string) => Buffer.from(s, "utf8").toString("base64url");

export function signToken(p: RemovePayload) {
  const d = b64(JSON.stringify(p));
  const s = crypto.createHmac("sha256", secret()).update(d).digest("base64url");
  return { d, s };
}

export function verifyToken(d?: string, s?: string): RemovePayload | null {
  if (!d || !s || !secret()) return null;
  const expected = crypto.createHmac("sha256", secret()).update(d).digest();
  let given: Buffer;
  try {
    given = Buffer.from(s, "base64url");
  } catch {
    return null;
  }
  if (given.length !== expected.length || !crypto.timingSafeEqual(given, expected)) return null;
  try {
    const p = JSON.parse(Buffer.from(d, "base64url").toString("utf8")) as RemovePayload;
    if (!p || typeof p.id !== "string" || typeof p.ts !== "number") return null;
    if (Date.now() - p.ts > MAX_AGE_MS) return null;
    return p;
  } catch {
    return null;
  }
}