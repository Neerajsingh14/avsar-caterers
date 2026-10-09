"use client";

import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, ConciergeBell, Flame, Gem, Heart, PartyPopper, Sparkles } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import Reveal from "@/components/ui/Reveal";
import { services } from "@/lib/services";

const icons: Record<string, typeof Heart> = {
  wedding: Heart,
  reception: PartyPopper,
  engagement: Gem,
  counters: Flame,
  hospitality: ConciergeBell,
};

export default function ServicesClient({ images }: { images: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.75, behavior: "smooth" });
  };
  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setActive(max > 0 ? Math.round((el.scrollLeft / max) * (services.length - 1)) : 0);
  };
  const jump = (i: number) => {
    const el = ref.current;
    const card = el?.children[i] as HTMLElement | undefined;
    if (el && card) el.scrollTo({ left: card.offsetLeft - (el.children[0] as HTMLElement).offsetLeft, behavior: "smooth" });
  };

  const arrow =
    "absolute top-[34%] z-10 hidden h-11 w-11 items-center md:flex justify-center rounded-full border border-gold/50 bg-ink/85 text-white shadow-lg backdrop-blur transition-colors hover:bg-gold hover:text-[var(--color-on-accent)]";

  return (
    <section id="services" className="overflow-hidden bg-coal py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Services</p>
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="mt-5 font-serif text-4xl text-white md:text-5xl">Catering Experiences for Every Celebration</h2>
          <p className="mt-4 text-white/60">From weddings to live counters, each service is shaped around your event.</p>
        </Reveal>

        <div className="relative mt-12 md:px-16">
          <button onClick={() => go(-1)} aria-label="Previous services" className={arrow + " left-0"}>
            <ArrowLeft size={18} />
          </button>
          <button onClick={() => go(1)} aria-label="Next services" className={arrow + " right-0"}>
            <ArrowRight size={18} />
          </button>

          <div
            ref={ref}
            onScroll={onScroll}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] md:gap-5 [&::-webkit-scrollbar]:hidden"
          >
            {services.map((s) => {
              const Icon = icons[s.id] ?? Sparkles;
              const img = images[s.id];
              return (
                <article
                  key={s.id}
                  className="group flex w-[82%] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-card1 to-card2 transition-colors duration-500 hover:border-gold/50 sm:w-[46%] lg:w-[31%] xl:w-[24%]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-card1 via-coal to-ink">
                    <div aria-hidden className="absolute inset-0 flex items-center justify-center">
                      <div className="absolute h-44 w-44 rounded-full border border-gold/20" />
                      <div className="absolute h-64 w-64 rounded-full border border-gold/10" />
                      <div className="absolute h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
                      <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-ink/50 text-gold">
                        <Icon size={34} strokeWidth={1.4} />
                      </div>
                    </div>
                    {img && (
                      <SafeImage
                        src={img}
                        alt={s.title}
                        sizes="(max-width: 640px) 82vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    <h3 className="font-serif text-xl text-white">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/65">{s.description}</p>
                    {s.tags && (
                      <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                        {s.tags.map((t) => (
                          <span key={t} className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] text-white/70">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-center gap-1.5" aria-hidden>
            {services.map((s, i) => (
              <button key={s.id} onClick={() => jump(i)} tabIndex={-1} className={"h-1.5 rounded-full transition-all duration-300 " + (i === active ? "w-5 bg-accent" : "w-1.5 bg-white/25")} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}