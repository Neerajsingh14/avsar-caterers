# Avsar Caterers - Tech Stack and Project Notes

Last updated: October 2026

Is file me project ki saari technology, services, folders aur roz ke kaam ke commands likhe hain.
**Is file me kabhi bhi asli password ya API key mat likhna** (repo public hai).

- GitHub repo: Neerajsingh14/avsar-caterers
- Live hosting: Vercel (project: avsar-caterers)
- Owner / contact: Vinod Rajpurohit
- Developer: Neeraj Rajpurohit

---

## 1. Main technology

| Kya | Kaam |
| --- | --- |
| Next.js (App Router) | Poori website ka framework. Pages, API aur server ek hi project me |
| React | Website ke components (navbar, gallery, form). Next.js ke andar hi aata hai |
| TypeScript | JavaScript ka safe version, galtiyan pehle hi pakad leta hai |
| Tailwind CSS (v4) | Design aur styling, aur 4 colour themes (CSS variables se) |
| Node.js + npm | Project chalane aur packages install karne ke liye |

Exact versions dekhne ke liye `package.json` kholo, ya chalao: `npm ls next react tailwindcss motion`

## 2. Packages (npm se install kiye)

| Package | Kaam |
| --- | --- |
| motion (Framer Motion) | Saari animations: hero, scroll reveal, popup, menu |
| lenis | Smooth scrolling |
| lucide-react | Saare icons |
| react-hook-form | Enquiry aur review form handle karna |
| zod | Form ka validation (phone, email, guests ka check), browser aur server dono me |
| @hookform/resolvers | React Hook Form aur Zod ko jodta hai |
| resend | Email bhejne ka package |
| image-size | Photo ki width/height padhna, taaki gallery sahi shape me dikhe |
| sharp | Photos chhoti aur .jpg banana (sirf computer par, conversion ke waqt) |
| heic-convert | iPhone ki .heic photos convert karna (sirf computer par) |
| ffmpeg-static | Videos ko web ke layak banana aur cover photo nikalna (sirf computer par) |

Aakhri 3 packages sirf conversion ke waqt kaam aaye. Live site ka hissa nahi hain.

## 3. Online services

| Service | Kaam | Kharcha |
| --- | --- | --- |
| GitHub | Code ka online backup aur version history | Free |
| Vercel | Website live karna. GitHub se juda hai, `git push` par apne aap update | Free (Hobby) sirf testing ke liye. Asli business launch par Pro (lagbhag $20/mahina) |
| Resend | Enquiry aur review ki email bhejna | Free plan (limit resend.com/pricing par dekho) |
| Gmail | Enquiry email yahan aati hai | Free |
| Google Fonts | Fonts: Playfair Display (headings), Inter (text) | Free |
| Google Maps (embed) | Contact section ka map | Free |
| WhatsApp / Instagram / LinkedIn | Sirf links, koi integration nahi | Free |

## 4. Tools

- VS Code: code likhne ka editor
- Git: code ka version control
- PowerShell scripts (setup-v1 se setup-v36): files aur code apne aap banane ke liye
- Browser DevTools aur terminal: check aur debug ke liye

## 5. Website ke features aur kaise bane

| Feature | Kaise bana |
| --- | --- |
| Enquiry form | 2 step wala form, react-hook-form + zod, phir /api/enquiry par jata hai |
| Email Vinod ji ko | Server Resend se HTML email bhejta hai (Call, WhatsApp, Email buttons ke saath) |
| Spam se bachav | Hidden honeypot field, server par validation, aur ek rate limit |
| Date range picker | Khud ka banaya calendar (from se to date) |
| Gallery | Folder se photos/videos apne aap padhti hai, popup viewer, "show more" arrow |
| Videos ka lag kam | Video tabhi load hoti hai jab screen ke paas aaye, ek saath max 4 chalte hain |
| Hero videos | Videos baari-baari chalte hain, crossfade ke saath (lib/hero-config.ts) |
| Reviews | Client form se review bhejta hai, owner ko email aati hai |
| Colour themes | 4 themes, choice browser me yaad rehti hai |
| Loading screen, custom cursor, scroll progress, scroll-to-top | Motion aur CSS se |
| SEO basics | Title, description, Open Graph, favicon, canonical |
| Developer credit | Footer me naam par LinkedIn link |

## 6. Folder structure

~~~
app/            pages, layout, API routes (enquiry, review)
components/     sections (Hero, Gallery...), forms, ui (Logo, Cursor...)
lib/            business info, services, reviews, gallery data, email, schemas
public/         photos/ aur videos/
docs/           ye notes
.env.local      secret keys (GitHub par nahi jati)
~~~

### Photos aur videos kahan daalni hain

| Folder | Kya |
| --- | --- |
| public/photos/gallery/ | Gallery ki saari photos (koi bhi naam) |
| public/photos/services/ | Service cards ki photos (wedding, reception, engagement, counters, hospitality) |
| public/photos/about/ | About section ki ek photo |
| public/videos/gallery/ | Gallery ke videos (naam me `reel` ya `vertical` likho to vertical card banta hai) |
| public/videos/hero/ | Hero ka apna video (optional) |

### Content kahan badalna hai

| File | Kya control karta hai |
| --- | --- |
| lib/business.ts | Naam, phone, WhatsApp, email, Instagram, location |
| lib/services.ts | Service cards |
| lib/whyus.ts | Why Choose Us section |
| lib/reviews.ts | Client reviews (sirf asli reviews) |
| lib/hero-config.ts | Hero me kaunse videos chalein |
| lib/gallery-hidden.ts | Gallery se kaunsi photo/video chhupani hai |
| lib/gallery-order.ts | Kaunsi photo/video pehle dikhani hai |

## 7. Secret values (Environment Variables)

Naam: `RESEND_API_KEY`, `BUSINESS_EMAIL`, `FROM_EMAIL`, `SEND_CLIENT_CONFIRMATION`, `NEXT_PUBLIC_SITE_URL`

- Computer par: `.env.local` file me
- Live site par: Vercel -> Settings -> Environment Variables
- Code me ya GitHub par kabhi nahi

## 8. Jo abhi use nahi hua (aage ke kaam)

- Database aur admin panel (Supabase se jodna hai)
- Login system, payment, analytics
- Sitemap, robots, structured data (SEO)
- Apna domain (abhi vercel.app ka link hai)
- Client ko confirmation email (apna domain Resend me verify hone ke baad)

## 9. Dhyan rakhne wali baatein

- Rate limit abhi server ki memory me hai. Vercel jaise serverless host par ye har instance me alag chalta hai, isliye ye basic spam rokne ke liye hai, pakka lock nahi. Admin panel ke saath behtar karenge.
- Great Vibes font layout.tsx me load ho rahi hai par ab kahin use nahi hoti. Hata dene se site thodi halki ho jayegi.
- Vercel ka free Hobby plan sirf non-commercial use ke liye hai. Asli clients ko link dene se pehle Pro plan lo (ya doosra host chuno).
- Vercel Hobby par bandwidth limit 100 GB/mahina hai. Videos zyada hone se ye jaldi poori ho sakti hai.
- Sample reviews sirf computer par dikhte hain, live site par apne aap chhup jate hain. Asli reviews lib/reviews.ts me daalo.

## 10. Roz ke kaam (cheat sheet)

Project chalana (computer par):

~~~
cd D:\Projects\avsar-caterers-rajasthan
npm run dev -- -p 3001
~~~

Live site update karna (Vercel apne aap update ho jata hai):

~~~
git add .
git commit -m "kya badla"
git push
~~~

Production jaisa test (computer par):

~~~
npm run build
npm start
~~~

| Kaam | Kaise |
| --- | --- |
| Nayi photo/video lagana | Sahi folder me daalo, phir git push |
| Photo/video chhupana | lib/gallery-hidden.ts me naam likho, phir git push |
| Phone/email/Instagram badalna | lib/business.ts, phir git push |
| Resend key badalna | Vercel Settings -> Environment Variables me badlo, phir Redeploy. Computer par .env.local me bhi |
| Galat update wapas lena | Vercel -> Deployments -> purane Ready deployment ke `...` -> Promote to Production |
| Browser me purana dikhe | Ctrl + Shift + R, ya incognito tab |

## 11. Resume / LinkedIn ke liye

> Avsar Caterers - business website (Next.js, TypeScript, Tailwind CSS, Motion, Resend, Vercel).
> Designed and built a lead-generation website for a wedding catering business, with a multi-step enquiry form that emails every enquiry to the owner, an optimized photo and video gallery, animations, and live deployment.