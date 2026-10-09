import type { EnquiryInput, ReviewInput } from "./schemas";
import { business } from "./business";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

function digits(phone: string) {
  let d = phone.replace(/\D/g, "");
  if (d.length === 11 && d.startsWith("0")) d = d.slice(1);
  if (d.length === 10) d = "91" + d;
  return d;
}

function prettyPhone(phone: string) {
  const d = digits(phone);
  if (d.length === 12 && d.startsWith("91")) return "+91 " + d.slice(2, 7) + " " + d.slice(7);
  return phone.trim();
}

const parse = (iso: string) => new Date(iso + "T00:00:00");

function longDate(iso: string) {
  const d = parse(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

function dayCount(start?: string, end?: string) {
  if (!start || !end || end === start) return 1;
  return Math.round((parse(end).getTime() - parse(start).getTime()) / 86400000) + 1;
}

function fullRange(start?: string, end?: string) {
  if (!start) return "Not decided yet";
  if (!end || end === start) return longDate(start);
  return longDate(start) + " to " + longDate(end) + " (" + dayCount(start, end) + " days)";
}

function shortRange(start?: string, end?: string) {
  if (!start) return "Not decided";
  const a = parse(start);
  if (isNaN(a.getTime())) return start;
  const mon = (d: Date) => d.toLocaleDateString("en-IN", { month: "short" });
  if (!end || end === start) return a.getDate() + " " + mon(a) + " " + a.getFullYear();
  const b = parse(end);
  if (a.getFullYear() !== b.getFullYear()) {
    return a.getDate() + " " + mon(a) + " " + a.getFullYear() + " - " + b.getDate() + " " + mon(b) + " " + b.getFullYear();
  }
  if (a.getMonth() === b.getMonth()) return a.getDate() + "-" + b.getDate() + " " + mon(a) + " " + a.getFullYear();
  return a.getDate() + " " + mon(a) + " - " + b.getDate() + " " + mon(b) + " " + b.getFullYear();
}

function nowIst() {
  return (
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" }) +
    " (IST)"
  );
}

const FONT = "Arial,Helvetica,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

const row = (label: string, value: string) => `
<tr>
  <td style="padding:13px 0;border-bottom:1px solid #eee3cf;width:34%;font-family:${FONT};font-size:11px;letter-spacing:1.5px;text-transform:uppercase;color:#9a8157;vertical-align:top;">${label}</td>
  <td style="padding:13px 0;border-bottom:1px solid #eee3cf;font-family:${FONT};font-size:15px;line-height:1.5;color:#1c1917;vertical-align:top;">${value}</td>
</tr>`;

const button = (href: string, label: string, bg: string, color: string) =>
  `<a href="${href}" style="display:inline-block;margin:0 8px 10px 0;padding:14px 26px;border-radius:999px;background:${bg};color:${color};font-family:${FONT};font-size:13px;font-weight:bold;letter-spacing:1px;text-decoration:none;">${label}</a>`;

const stat = (label: string, value: string) => `
<td align="center" style="padding:18px 10px;background:#fbf6ec;border:1px solid #eee3cf;">
  <div style="font-family:${FONT};font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#9a8157;">${label}</div>
  <div style="margin-top:8px;font-family:${SERIF};font-size:20px;line-height:1.25;color:#1c1917;">${value}</div>
</td>`;

function wrap(preheader: string, inner: string) {
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Avsar Caterers</title></head>
<body style="margin:0;padding:0;background:#efe7d8;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:#efe7d8;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe7d8;">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">
    ${inner}
  </table>
  <p style="margin:18px 0 0;font-family:${FONT};font-size:12px;color:#9a8157;">Avsar Caterers &middot; Rajasthan, India</p>
</td></tr></table>
</body></html>`;
}

export function ownerEmail(d: EnquiryInput) {
  const fullName = oneLine(d.firstName + " " + (d.lastName ?? ""));
  const eventType = oneLine(d.eventType);
  const guests = oneLine(d.guests);
  const hasDate = !!d.eventStart;
  const short = shortRange(d.eventStart, d.eventEnd);

  const subject =
    "New Catering Enquiry - " + eventType + " - " + guests + " Guests" + (hasDate ? " - " + short : "");

  const num = digits(d.phone);
  const phoneShown = prettyPhone(d.phone);
  const telHref = "tel:+" + num;
  const waHref =
    "https://wa.me/" + num + "?text=" +
    encodeURIComponent("Hello " + d.firstName + ", this is Avsar Caterers. Thank you for your catering enquiry.");
  const mailHref =
    "mailto:" + d.email + "?subject=" + encodeURIComponent("Your catering enquiry - Avsar Caterers");

  const message = d.message
    ? esc(d.message).replace(/\n/g, "<br>")
    : '<span style="color:#9a8157;">No additional requirements mentioned.</span>';

  const inner = `
<tr><td style="background:#080504;padding:30px 32px 26px;border-top:4px solid #f5c76d;">
  <div style="font-family:${FONT};font-size:12px;letter-spacing:5px;color:#f5c76d;">AVSAR CATERERS</div>
  <div style="margin-top:14px;font-family:${SERIF};font-size:27px;line-height:1.2;color:#ffffff;">New Catering Enquiry</div>
  <div style="margin-top:8px;font-family:${FONT};font-size:13px;color:#b9ab93;">Received ${nowIst()}</div>
</td></tr>

<tr><td style="padding:24px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:separate;border-spacing:0;">
    <tr>
      ${stat("Event", esc(eventType))}
      ${stat("Guests", esc(guests))}
      ${stat("Date", esc(short))}
    </tr>
  </table>
</td></tr>

<tr><td style="padding:26px 32px 0;">
  <div style="font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8157;">Client</div>
  <div style="margin-top:8px;font-family:${SERIF};font-size:24px;color:#1c1917;">${esc(fullName)}</div>
  <div style="margin-top:10px;font-family:${FONT};font-size:15px;line-height:1.9;color:#1c1917;">
    <a href="${telHref}" style="color:#d9531a;font-weight:bold;text-decoration:none;">${esc(phoneShown)}</a><br>
    <a href="mailto:${esc(d.email)}" style="color:#1c1917;text-decoration:none;">${esc(d.email)}</a>
  </div>
</td></tr>

<tr><td style="padding:14px 32px 0;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Event Date", esc(fullRange(d.eventStart, d.eventEnd)))}
    ${row("Location / Venue", esc(d.location))}
  </table>
</td></tr>

<tr><td style="padding:22px 32px 0;">
  <div style="font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#9a8157;">Additional Requirements</div>
  <div style="margin-top:10px;padding:16px 18px;background:#fbf6ec;border-left:4px solid #f5c76d;border-radius:6px;font-family:${FONT};font-size:15px;line-height:1.65;color:#1c1917;">${message}</div>
</td></tr>

<tr><td style="padding:28px 32px 8px;">
  ${button(telHref, "CALL CLIENT", "#f26a21", "#ffffff")}
  ${button(waHref, "WHATSAPP CLIENT", "#25D366", "#ffffff")}
  ${button(mailHref, "EMAIL CLIENT", "#080504", "#f5c76d")}
</td></tr>

<tr><td style="padding:6px 32px 30px;">
  <div style="font-family:${FONT};font-size:12px;line-height:1.6;color:#9a8157;">Tip: replying to this email sends your answer straight to the client.</div>
</td></tr>`;

  const html = wrap(eventType + " | " + guests + " guests | " + short + " | " + fullName, inner);

  const text = [
    "NEW CATERING ENQUIRY",
    "",
    "Client Name: " + fullName,
    "Phone: " + phoneShown,
    "Email: " + d.email,
    "Event Type: " + eventType,
    "Guests: " + guests,
    "Event Date: " + fullRange(d.eventStart, d.eventEnd),
    "Location / Venue: " + d.location,
    "Additional Requirements: " + (d.message || "None"),
    "Submitted: " + nowIst(),
  ].join("\n");

  return { subject, html, text };
}

export function clientEmail(d: EnquiryInput) {
  const wa =
    "https://wa.me/" + business.whatsappNumber + "?text=" + encodeURIComponent(business.whatsappMessage);
  const subject = "Thank You for Contacting Avsar Caterers";

  const inner = `
<tr><td style="background:#080504;padding:30px 32px;border-top:4px solid #f5c76d;">
  <div style="font-family:${FONT};font-size:12px;letter-spacing:5px;color:#f5c76d;">AVSAR CATERERS</div>
</td></tr>
<tr><td style="padding:30px 32px;font-family:${FONT};font-size:15px;line-height:1.75;color:#1c1917;">
  <p style="margin:0 0 14px;">Dear ${esc(d.firstName)},</p>
  <p style="margin:0 0 14px;">Thank you for sharing your event details with Avsar Caterers.</p>
  <p style="margin:0 0 14px;">Our team will review your requirements and contact you shortly to discuss your menu, guest count, event schedule and catering requirements.</p>
  <p style="margin:0 0 22px;">For urgent enquiries, call <strong>${business.phone}</strong>.</p>
  ${button(wa, "WHATSAPP US", "#25D366", "#ffffff")}
  <p style="margin:22px 0 0;color:#9a8157;">Warm regards,<br>${business.owner}<br>Avsar Caterers</p>
</td></tr>`;

  const html = wrap("Thank you for contacting Avsar Caterers", inner);
  const text =
    "Dear " + d.firstName + ",\n\nThank you for sharing your event details with Avsar Caterers. Our team will review your requirements and contact you shortly.\n\nFor urgent enquiries: " +
    business.phone + "\n\nAvsar Caterers";
  return { subject, html, text };
}

export function reviewEmail(d: ReviewInput) {
  const subject = "New Review - " + d.rating + " Star - " + oneLine(d.name);
  const stars = "\u2605".repeat(d.rating) + "\u2606".repeat(5 - d.rating);

  const inner = `
<tr><td style="background:#080504;padding:30px 32px;border-top:4px solid #f5c76d;">
  <div style="font-family:${FONT};font-size:12px;letter-spacing:5px;color:#f5c76d;">AVSAR CATERERS</div>
  <div style="margin-top:14px;font-family:${SERIF};font-size:27px;color:#ffffff;">New Client Review</div>
</td></tr>
<tr><td style="padding:14px 32px 26px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
    ${row("Name", esc(oneLine(d.name)))}
    ${row("Event Type", esc(oneLine(d.eventType)))}
    ${row("Rating", '<span style="color:#e8a317;font-size:20px;letter-spacing:2px;">' + stars + "</span>")}
    ${row("Review", esc(d.text).replace(/\n/g, "<br>"))}
    ${row("Submitted", nowIst())}
  </table>
  <p style="margin:18px 0 0;font-family:${FONT};font-size:12px;color:#9a8157;">To show this review on the website, add it to lib/reviews.ts.</p>
</td></tr>`;

  const html = wrap("New review from " + oneLine(d.name), inner);
  const text =
    "NEW CLIENT REVIEW\n\nName: " + d.name + "\nEvent: " + d.eventType + "\nRating: " + d.rating + "/5\nReview: " + d.text + "\nSubmitted: " + nowIst();
  return { subject, html, text };
}