# Avsar Caterers

Website for **Avsar Caterers**, a premium wedding and event catering business based in Rajasthan, India.

Visitors can see the services, photos and videos of real events, read reviews, and send a catering enquiry. Every enquiry is emailed to the business owner.

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- Motion (Framer Motion) and Lenis smooth scroll
- React Hook Form and Zod
- Resend (enquiry and review emails)

## Run on your computer

```bash
npm install
npm run dev
```

Open http://localhost:3000

Production build:

```bash
npm run build
npm start
```

## Environment variables

Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local`.

| Name | Purpose |
| --- | --- |
| `RESEND_API_KEY` | API key from resend.com |
| `BUSINESS_EMAIL` | Inbox that receives the enquiries |
| `FROM_EMAIL` | Sender address (use `onboarding@resend.dev` for testing) |
| `SEND_CLIENT_CONFIRMATION` | `true` sends a thank-you email to the client (needs a verified domain) |
| `NEXT_PUBLIC_SITE_URL` | Live website address, for example `https://yourdomain.com` |

## Adding photos and videos

Files are picked up automatically from these folders. Any file name and format works.

| Folder | What goes here |
| --- | --- |
| `public/photos/gallery/` | Gallery photos |
| `public/photos/services/` | Service card photos |
| `public/photos/about/` | One photo for the About section |
| `public/videos/gallery/` | Gallery videos (add `reel` or `vertical` in the name for vertical videos) |
| `public/videos/hero/` | Optional hero background video |

## Where to edit content

| File | What it controls |
| --- | --- |
| `lib/business.ts` | Name, phone, WhatsApp, email, Instagram, location |
| `lib/services.ts` | Service cards |
| `lib/whyus.ts` | Why Choose Us section |
| `lib/reviews.ts` | Client reviews (real reviews only) |
| `lib/hero-config.ts` | Videos that play in the hero section |
| `lib/gallery-hidden.ts` | Photos and videos to hide from the gallery |
| `lib/gallery-order.ts` | Photos and videos to show first |

## Enquiry flow

The visitor fills the form, the server (`app/api/enquiry`) validates it, blocks spam (hidden field and rate limit) and emails the owner through Resend. Reviews work the same way through `app/api/review`.

## Deploying

Deploy on Vercel by importing this repository and adding the environment variables above in the project settings.