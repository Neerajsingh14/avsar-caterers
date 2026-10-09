import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { business, emailLink, whatsappLink } from "@/lib/business";
import { services } from "@/lib/services";

// Developer credit: naam yahan badal sakte ho
const developer = "Neeraj Rajpurohit";

const social = [
  { label: "Instagram", href: business.instagram, icon: InstagramIcon, external: true },
  { label: "WhatsApp", href: whatsappLink, icon: WhatsAppIcon, external: true },
  { label: "Email", href: emailLink, icon: Mail },
  { label: "Call", href: business.phoneLink, icon: Phone },
];

const heading = "text-xs font-semibold uppercase tracking-[0.3em] text-gold";
const link = "text-sm text-white/65 transition-colors hover:text-gold";

export default function Footer() {
  const [emailUser, emailHost] = business.email.split("@");
  return (
    <footer className="relative overflow-x-clip border-t border-white/10 bg-ink">
      <div aria-hidden className="pointer-events-none absolute -top-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="my-12 rounded-3xl border border-gold/30 bg-gradient-to-r from-card1 to-card2 p-7 md:flex md:items-center md:justify-between md:p-9">
          <div>
            <p className="font-serif text-2xl text-white md:text-3xl">Planning a celebration in Rajasthan?</p>
            <p className="mt-2 text-sm text-white/60">Tell us about your event and get a customized quotation.</p>
          </div>
          <Link href="#quote" className="btn-primary mt-5 px-7 py-3.5 text-sm tracking-wider md:mt-0">
            BOOK YOUR DATE <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-12 pb-12 pt-2 md:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1.3fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/65">
              Avsar Caterers is a Rajasthan-based catering and hospitality service for weddings,
              receptions, engagement functions and celebrations. From live counters to trained
              serving staff, every event is planned around your guests, your menu and your budget.
            </p>
            <div className="mt-6 flex gap-3">
              {social.map(({ label, href, icon: Icon, external }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold hover:text-gold"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className={heading}>Services</p>
            <ul className="mt-5 space-y-3">
              {services.map((s) => (
                <li key={s.id}><Link href="#services" className={link}>{s.title}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <p className={heading}>Contact</p>
            <ul className="mt-5 space-y-4 text-sm text-white/65">
              <li className="text-white/85">{business.owner}</li>
              <li><a href={business.phoneLink} className="flex items-center gap-3 hover:text-gold"><Phone size={15} className="shrink-0 text-gold" /> {business.phone}</a></li>
              <li>
                <a href={emailLink} className="flex items-start gap-3 hover:text-gold">
                  <Mail size={15} className="mt-0.5 shrink-0 text-gold" />
                  <span>{emailUser}@<wbr />{emailHost}</span>
                </a>
              </li>
              <li><a href={business.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-gold"><InstagramIcon size={15} className="shrink-0 text-gold" /> {business.instagramHandle}</a></li>
              <li className="flex items-center gap-3"><MapPin size={15} className="shrink-0 text-gold" /> {business.location.display}</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 border-t border-white/10 py-7 text-center md:flex-row md:text-left">
          <p className="text-sm text-white/50">&copy; 2026 Avsar Caterers. All Rights Reserved.</p>
          <p className="text-xs uppercase tracking-[0.25em] text-white/40">Premium Catering &amp; Hospitality &middot; Rajasthan, India</p>
        </div>

        <div className="border-t border-white/[0.07] pb-8 pt-5 text-center">
          <p className="text-xs tracking-wide text-white/45">
            Designed &amp; developed with <span className="text-gold" aria-label="love">&hearts;</span> by{" "}
            <span className="font-medium text-gold">{developer}</span>
          </p>
        </div>
      </div>
    </footer>
  );
}