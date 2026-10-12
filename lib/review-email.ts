import type { ReviewInput } from "./schemas";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

const FONT = "Arial,Helvetica,sans-serif";
const SERIF = "Georgia,'Times New Roman',serif";

function nowIst() {
  return (
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long", timeStyle: "short" }) +
    " (IST)"
  );
}

export function buildReviewEmail(d: ReviewInput, opts: { published: boolean; removeUrl?: string }) {
  const name = oneLine(d.name);
  const event = oneLine(d.eventType);
  const subject = "New Review - " + d.rating + " Star - " + name;
  const stars = "\u2605".repeat(d.rating) + "\u2606".repeat(5 - d.rating);
  const text = esc(d.text).replace(/\n/g, "<br>");

  const status = opts.published
    ? `<div style="display:inline-block;padding:6px 14px;border-radius:999px;background:#e6f6ea;color:#18793a;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1px;">LIVE ON WEBSITE</div>`
    : `<div style="display:inline-block;padding:6px 14px;border-radius:999px;background:#fdecd8;color:#a85a00;font-family:${FONT};font-size:12px;font-weight:bold;letter-spacing:1px;">NOT PUBLISHED (automatic publishing failed)</div>`;

  const action =
    opts.published && opts.removeUrl
      ? `<a href="${esc(opts.removeUrl)}" style="display:inline-block;padding:14px 28px;border-radius:999px;background:#b3261e;color:#ffffff;font-family:${FONT};font-size:13px;font-weight:bold;letter-spacing:1px;text-decoration:none;">REMOVE FROM WEBSITE</a>
         <div style="margin-top:14px;font-family:${FONT};font-size:12px;line-height:1.6;color:#9a8157;">This review is already visible on your website. If it is spam or not from a real client, tap the button to remove it.</div>`
      : `<div style="font-family:${FONT};font-size:12px;line-height:1.6;color:#9a8157;">${
          opts.published
            ? "This review is already visible on your website."
            : "This review could not be added automatically. Please contact the developer to add it."
        }</div>`;

  const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Review</title></head>
<body style="margin:0;padding:0;background:#efe7d8;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#efe7d8;">
<tr><td align="center" style="padding:28px 12px;">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#ffffff;border-radius:18px;overflow:hidden;">
    <tr><td style="background:#080504;padding:30px 32px 26px;border-top:4px solid #f5c76d;">
      <div style="font-family:${FONT};font-size:12px;letter-spacing:5px;color:#f5c76d;">AVSAR CATERERS</div>
      <div style="margin-top:14px;font-family:${SERIF};font-size:27px;line-height:1.2;color:#ffffff;">New Client Review</div>
      <div style="margin-top:8px;font-family:${FONT};font-size:13px;color:#b9ab93;">Received ${nowIst()}</div>
    </td></tr>
    <tr><td style="padding:24px 32px 0;">${status}</td></tr>
    <tr><td style="padding:20px 32px 0;">
      <div style="font-family:${SERIF};font-size:24px;color:#1c1917;">${esc(name)}</div>
      <div style="margin-top:6px;font-family:${FONT};font-size:14px;color:#9a8157;">${esc(event)}</div>
      <div style="margin-top:10px;color:#e8a317;font-size:22px;letter-spacing:3px;">${stars}</div>
    </td></tr>
    <tr><td style="padding:18px 32px 0;">
      <div style="padding:18px 20px;background:#fbf6ec;border-left:4px solid #f5c76d;border-radius:6px;font-family:${FONT};font-size:15px;line-height:1.7;color:#1c1917;">${text}</div>
    </td></tr>
    <tr><td style="padding:28px 32px 32px;">${action}</td></tr>
  </table>
</td></tr></table>
</body></html>`;

  const plain =
    "NEW CLIENT REVIEW (" + (opts.published ? "live on website" : "NOT published") + ")\n\nName: " + name +
    "\nEvent: " + event + "\nRating: " + d.rating + "/5\nReview: " + d.text + "\nSubmitted: " + nowIst() +
    (opts.removeUrl ? "\n\nRemove from website: " + opts.removeUrl : "");

  return { subject, html, text: plain };
}