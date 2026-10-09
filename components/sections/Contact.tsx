import { BadgeCheck, Mail, MapPin, Phone } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import SafeImage from "@/components/ui/SafeImage";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { business, emailLink, whatsappLink } from "@/lib/business";
import { standards } from "@/lib/certificates";

const card =
  "flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-card1 to-card2 p-6 md:p-7";

function Eyebrow({ children }: { children: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8 bg-gold" />
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{children}</p>
    </div>
  );
}

export default function Contact() {
  const hasCerts = standards.some((s) => s.image);
  const items = [
    { icon: Phone, label: business.phone, href: business.phoneLink },
    { icon: Mail, label: business.email, href: emailLink },
    { icon: InstagramIcon, label: business.instagramHandle, href: business.instagram, external: true },
  ];

  return (
    <section id="contact" className="bg-ink py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-5 px-5 lg:grid-cols-[3fr_4fr_3fr]">
        {/* Certificates - 30% */}
        <Reveal className="h-full">
          <div className={card}>
            <Eyebrow>{hasCerts ? "Certificates" : "Our Standards"}</Eyebrow>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-white md:text-3xl">
              Standards that signal trust
            </h2>
            <ul className="mt-6 space-y-3">
              {standards.map((s) => (
                <li key={s.title} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-3">
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-card1 to-ink text-gold">
                    <BadgeCheck size={26} strokeWidth={1.4} />
                    {s.image && <SafeImage src={s.image} alt={s.title} sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">{s.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-white/60">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* Map - 40% */}
        <Reveal delay={0.1} className="h-full">
          <div className={card}>
            <Eyebrow>Location</Eyebrow>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-white md:text-3xl">
              Serving celebrations across Rajasthan &amp; beyond
            </h2>
            <div className="mt-6 min-h-[300px] flex-1 overflow-hidden rounded-2xl">
              <iframe
                title="Map of Rajasthan, India"
                src={business.location.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[300px] w-full border-0"
              />
            </div>
          </div>
        </Reveal>

        {/* Contact - 30% */}
        <Reveal delay={0.2} className="h-full">
          <div className={card}>
            <Eyebrow>Contact</Eyebrow>
            <h2 className="mt-4 font-serif text-2xl leading-tight text-white md:text-3xl">
              Let&rsquo;s plan your next catered event
            </h2>
            <p className="mt-2 text-sm text-white/60">{business.owner}</p>

            <ul className="mt-6 space-y-4">
              {items.map(({ icon: Icon, label, href, external }) => (
                <li key={label}>
                  <a
                    href={href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group flex items-center gap-3 text-sm text-white/85 transition-colors hover:text-gold"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold transition-colors group-hover:bg-gold group-hover:text-[var(--color-on-accent)]">
                      <Icon size={17} />
                    </span>
                    <span className="min-w-0 break-words">{label}</span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-3 text-sm text-white/85">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                  <MapPin size={17} />
                </span>
                <span>{business.location.display}</span>
              </li>
            </ul>

            <div className="mt-auto flex flex-wrap gap-3 pt-8">
              <a href="#quote" className="btn-primary px-6 py-3 text-sm">Book Your Date</a>
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
              >
                <WhatsAppIcon size={16} /> WhatsApp
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}