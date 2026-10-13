# Avsar Caterers

Website for **Avsar Caterers**, a premium wedding and event catering business based in Rajasthan, India.

Visitors can explore the services, see photos and videos of real events, read client reviews, and send a catering enquiry. Every enquiry is emailed to the business owner with one-tap Call, WhatsApp and Email buttons.

- Live site: https://avsar-caterers.vercel.app
- Built by: Neeraj Rajpurohit

## Features

- Cinematic hero with a looping video playlist, smooth scrolling and scroll animations
- Multi-step enquiry form (event type, guests, date range, contact details) with live validation
- Enquiries emailed to the owner as a formatted HTML email
- Photo and video gallery that reads files from folders automatically, with a fullscreen viewer
- Client reviews that go live instantly, with a remove link in the owner's email
- Four switchable colour themes, custom cursor, loading screen and mobile menu
- Floating WhatsApp button and spam protection (honeypot field, server-side validation, rate limit)

## Tech stack

- Next.js (App Router) and TypeScript
- Tailwind CSS
- Motion (Framer Motion) and Lenis smooth scroll
- React Hook Form and Zod
- Resend for email
- Vercel for hosting

Full notes: [docs/TECH-STACK.md](docs/TECH-STACK.md)

## Requirements

- Node.js 20 or newer (the LTS version from https://nodejs.org). Check with `node -v`
- Git. Check with `git --version`
- A free Resend account (https://resend.com) to send emails
- Optional: a GitHub token, only if you want client reviews to be published automatically

## Quick start

**1. Get the code**

~~~bash
git clone https://github.com/Neerajsingh14/avsar-caterers.git
cd avsar-caterers
~~~

**2. Install packages**

~~~bash
npm install
~~~

**3. Create your environment file**

Windows (PowerShell):

~~~powershell
copy .env.example .env.local
~~~

Mac or Linux:

~~~bash
cp .env.example .env.local
~~~

**4. Fill in `.env.local`** (see the table below)

**5. Start the site**

~~~bash
npm run dev
~~~

Open http://localhost:3000. If that port is busy, use another one:

~~~bash
npm run dev -- -p 3001
~~~

Restart the dev server every time you change `.env.local`.

## Environment variables

| Name | Needed for | Notes |
| --- | --- | --- |
| `RESEND_API_KEY` | Emails | Starts with `re_`. Created in Resend, API Keys |
| `BUSINESS_EMAIL` | Emails | The inbox that receives enquiries and reviews. While you use `onboarding@resend.dev` as sender, this must be the same email you used to sign up on Resend |
| `FROM_EMAIL` | Emails | Use `onboarding@resend.dev` for testing. Use your own verified domain later |
| `SEND_CLIENT_CONFIRMATION` | Optional | `true` sends a thank-you email to the client. Needs a verified domain in Resend |
| `NEXT_PUBLIC_SITE_URL` | SEO | `http://localhost:3000` locally, your real address when live |
| `GITHUB_TOKEN` | Reviews | Optional. Lets the site save approved reviews into this repo |
| `GITHUB_REPO` | Reviews | `owner/repo`, for example `Neerajsingh14/avsar-caterers` |
| `REVIEW_APPROVE_SECRET` | Reviews | Any long random text. Signs the "remove review" link in the owner's email |

What happens if something is missing:

- No Resend values: the site opens, but the enquiry and review forms show an error.
- No GitHub values: reviews are emailed to the owner but are not published on the site.

### Get a Resend key

1. Sign up at https://resend.com with the email that should receive the enquiries.
2. Open **API Keys**, click **Create API Key** (Sending access) and copy it.
3. Put it in `.env.local` as `RESEND_API_KEY`.

### Create a GitHub token (only for automatic reviews)

1. GitHub, profile photo, **Settings**, **Developer settings**, **Personal access tokens**, **Fine-grained tokens**, **Generate new token**.
2. Set an expiry date. Note it, because you must create a new token before it expires.
3. **Repository access**: choose **Only select repositories** and pick this repository. The option **Public repositories** is read-only and will not work.
4. **Repository permissions**: click **Add permissions**, choose **Contents** and set it to **Read and write**.
5. Generate the token and copy it right away (GitHub shows it only once).
6. Put it in `.env.local` as `GITHUB_TOKEN`, set `GITHUB_REPO`, and create a random secret:

~~~bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
~~~

Use the printed text as `REVIEW_APPROVE_SECRET`.

Never paste tokens or keys into chats, screenshots, code or this README.

## Test that it works

1. Open the site, scroll to **Get a Quote** and submit a test enquiry. The email should arrive in `BUSINESS_EMAIL`. Check the Spam folder too.
2. Open **Reviews**, click **Write a Review**, and submit a review named `TEST ONLY`. It should appear on the page within a minute, and the email has a **Remove from website** button. Use it to remove the test review.

## Project structure

~~~
app/            pages, layout and API routes (enquiry, review, remove-review)
components/     sections (Hero, Gallery, Reviews...), forms and ui helpers
lib/            business info, services, gallery data, email templates, schemas
data/           reviews.json (approved client reviews)
public/         photos and videos
docs/           technical notes
~~~

## Add or change content

Photos and videos are picked up automatically. Any file name and format works.

| Folder | What goes here |
| --- | --- |
| `public/photos/gallery/` | Gallery photos |
| `public/photos/services/` | Service card photos (wedding, reception, engagement, counters, hospitality) |
| `public/photos/about/` | One photo for the About section |
| `public/videos/gallery/` | Gallery videos. Add `reel` or `vertical` to the file name for vertical videos |
| `public/videos/hero/` | Optional hero background video |

Tips:

- Use `.jpg` or `.webp` for photos and `.mp4` (H.264) for videos. Convert iPhone `.heic` photos to `.jpg` first.
- Keep each video under about 20 MB and photos under about 2000 px wide, so the site stays fast on mobile.
- GitHub rejects files larger than 100 MB.
- Restart the dev server after adding new files.

Where to edit text and settings:

| File | What it controls |
| --- | --- |
| `lib/business.ts` | Name, phone, WhatsApp, email, Instagram, location |
| `lib/services.ts` | Service cards |
| `lib/whyus.ts` | Why Choose Us section |
| `lib/hero-config.ts` | Which gallery videos play in the hero |
| `lib/gallery-hidden.ts` | Photos and videos to hide from the gallery |
| `lib/gallery-order.ts` | Photos and videos to show first |
| `data/reviews.json` | Approved reviews (normally managed by the site) |

## Client reviews

1. A visitor submits a review. It is saved to `data/reviews.json` in this repository and appears on the site within about a minute.
2. The owner gets an email with a **Remove from website** button, to take down spam or fake reviews.
3. Sample cards are shown only on your computer, never on the live site.

Because the site commits to this repository, always run `git pull` before `git push` on your computer.

## Build for production

~~~bash
npm run build
npm start
~~~

## Deploy on Vercel

1. Push this repository to GitHub.
2. On https://vercel.com choose **Add New**, **Project** and import the repository.
3. Under **Environment Variables**, add every value from `.env.local`. Mark tokens and keys as **Sensitive**.
4. Click **Deploy**. Later, every `git push` deploys automatically.
5. After changing an environment variable, open **Deployments**, the `...` menu of the latest deployment, and choose **Redeploy**. Old deployments do not see new values.

Note: Vercel's free Hobby plan is meant for personal, non-commercial use. A live business site should use a paid plan or another host.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |

## Troubleshooting

| Problem | What to try |
| --- | --- |
| `npm install` fails | Update Node.js to version 20 or newer, then delete `node_modules` and run it again |
| Form says the service is not available | `RESEND_API_KEY`, `BUSINESS_EMAIL` or `FROM_EMAIL` is missing. Fix `.env.local` and restart |
| No email arrives | Check Spam. With `onboarding@resend.dev`, `BUSINESS_EMAIL` must be your Resend sign-up email |
| Review is emailed but not on the site | The GitHub values are missing, the token cannot write, or Vercel was not redeployed. The token needs **Contents: Read and write** |
| Changes in `.env.local` are ignored | Restart the dev server |
| New photo or video is not visible | Check the folder, then restart the dev server and hard refresh with Ctrl+Shift+R |
| `git push` is rejected | Run `git pull`, then push again |
| Push blocked by GitHub for a secret | A key is inside a file. Remove it, revoke that key and create a new one |

## Security notes

- `.env.local` is ignored by Git. Never commit it.
- Keep keys and tokens only in `.env.local` and in Vercel's environment variables.
- If a key is ever shown in a chat, screenshot or commit, revoke it and create a new one.