import { NextResponse } from "next/server";
import { Resend } from "resend";
import { reviewSchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { reviewEmail } from "@/lib/email";

export const runtime = "nodejs";

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
  if (data.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BUSINESS_EMAIL;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Email is not configured");
    return NextResponse.json({ error: "Review service is not available right now." }, { status: 500 });
  }

  const resend = new Resend(apiKey);
  const mail = reviewEmail(data);
  const { error } = await resend.emails.send({
    from: "Avsar Caterers Website <" + from + ">",
    to: [to],
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
  });
  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ error: "Could not send your review. Please try again." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}