import {
  CalendarCheck, ConciergeBell, Flame, MapPin, Music, Palette, PhoneCall,
  Sparkles, UserCheck, Users, UtensilsCrossed, Wallet,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { whyUs, whyUsIntro } from "@/lib/whyus";

const icons = {
  users: Users,
  utensils: UtensilsCrossed,
  bell: ConciergeBell,
  usercheck: UserCheck,
  sparkles: Sparkles,
  palette: Palette,
  calendar: CalendarCheck,
  flame: Flame,
  map: MapPin,
  wallet: Wallet,
  music: Music,
  phone: PhoneCall,
} as const;

export default function WhyUs() {
  return (
    <section id="why-us" className="bg-ink py-16 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Why Us</p>
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="mt-5 font-serif text-3xl text-white sm:text-4xl md:text-5xl">Why Choose Avsar Caterers?</h2>
          <p className="mt-5 leading-relaxed text-white/65">{whyUsIntro}</p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 md:gap-5 lg:grid-cols-3">
          {whyUs.map((item, i) => {
            const Icon = icons[item.icon];
            return (
              <Reveal key={item.title} delay={(i % 3) * 0.06}>
                <div className="h-full rounded-2xl border border-white/10 bg-coal p-6 transition-colors duration-500 hover:border-gold/50 md:p-7">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold">
                    <Icon size={22} />
                  </div>
                  <h3 className="mt-5 font-serif text-xl text-white">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">{item.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}