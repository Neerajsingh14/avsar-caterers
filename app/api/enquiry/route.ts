import { NextResponse } from "next/server";
import { Resend } from "resend";
import { enquirySchema } from "@/lib/schemas";
import { rateLimit } from "@/lib/rateLimit";
import { ownerEmail, clientEmail } from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!rateLimit("enquiry:" + ip, 5, 10 * 60 * 1000)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later or call us directly." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = enquirySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check your details and try again." }, { status: 400 });
  }
  const data = parsed.data;

  // Honeypot: bots fill this hidden field. Pretend success, send nothing.
  if (data.website) return NextResponse.json({ ok: true });

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.BUSINESS_EMAIL;
  const from = process.env.FROM_EMAIL;
  if (!apiKey || !to || !from) {
    console.error("Email is not configured: set RESEND_API_KEY, BUSINESS_EMAIL, FROM_EMAIL");
    return NextResponse.json(
      { error: "Our enquiry service is not available right now. Please call or WhatsApp us." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const owner = ownerEmail(data);

  const { error } = await resend.emails.send({
    from: "Avsar Caterers Website <" + from + ">",
    to: [to],
    replyTo: data.email,
    subject: owner.subject,
    html: owner.html,
    text: owner.text,
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json(
      { error: "We could not send your enquiry. Please call or WhatsApp us." },
      { status: 502 }
    );
  }

  if (process.env.SEND_CLIENT_CONFIRMATION === "true") {
    try {
      const c = clientEmail(data);
      await resend.emails.send({
        from: "Avsar Caterers <" + from + ">",
        to: [data.email],
        subject: c.subject,
        html: c.html,
        text: c.text,
      });
    } catch (e) {
      console.error("Client confirmation failed:", e);
    }
  }

  return NextResponse.json({ ok: true });
}