import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { Resend } from "resend";
import { reviewSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { buildReviewEmail } from "@/lib/review-email";
import { signToken } from "@/lib/review-token";
import { githubConfig, updateReviews } from "@/lib/github-reviews";
import type { Review } from "@/lib/reviews";

export const runtime = "nodejs";

const hasLink = (s: string) => /https?:\/\/|www\./i.test(s);
const norm = (s: string) => s.toLowerCase().replace(/\s+/g, " ").trim();

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit("review:" + ip, 3, 30 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many submissions. Please try again later." }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your review and try again." }, { status: 400 });
  }
  const data = parsed.data;
  if (data.website) return NextResponse.json({ ok: true }); // spam bot, pretend success

  if (hasLink(data.text) || hasLink(data.name)) {
    return NextResponse.json({ error: "Please do not include links in your review." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BUSINESS_EMAIL;
  const from = process.env.FROM_EMAIL;

  const review: Review = {
    id: "r-" + crypto.randomBytes(5).toString("hex"),
    name: data.name.trim().slice(0, 60),
    eventType: data.eventType,
    rating: data.rating,
    text: data.text.trim().slice(0, 1500),
    date: new Date().toISOString().slice(0, 10),
  };

  // 1) publish: save to data/reviews.json
  let published = false;
  if (githubConfig()) {
    try {
      const res = await updateReviews((list) => {
        if (list.some((r) => norm(r.text) === norm(review.text))) return null; // duplicate
        return [...list, review];
      }, "Add client review: " + review.name.slice(0, 40));
      published = res === "ok";
      if (published) revalidatePath("/");
    } catch (e) {
      console.error("Review publish failed:", e);
    }
  } else {
    console.error("GITHUB_TOKEN is not set, review was not published");
  }

  // 2) tell the owner by email
  let emailed = false;
  if (apiKey && to && from) {
    let removeUrl: string | undefined;
    if (published && process.env.REVIEW_APPROVE_SECRET) {
      const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
      const proto = req.headers.get("x-forwarded-proto") ?? (host?.startsWith("localhost") ? "http" : "https");
      if (host) {
        const { d, s } = signToken({ id: review.id, ts: Date.now() });
        removeUrl = proto + "://" + host + "/remove-review?d=" + d + "&s=" + s;
      }
    }
    const mail = buildReviewEmail(data, { published, removeUrl });
    const { error } = await new Resend(apiKey).emails.send({
      from: "Avsar Caterers Website <" + from + ">",
      to: [to],
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
    });
    if (error) console.error("Resend error:", error);
    else emailed = true;
  }

  if (!published && !emailed) {
    return NextResponse.json({ error: "Could not send your review. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true, published });
}