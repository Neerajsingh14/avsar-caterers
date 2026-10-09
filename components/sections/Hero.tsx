"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown, MapPin, Phone } from "lucide-react";
import { business, whatsappLink } from "@/lib/business";
import { services } from "@/lib/services";

const ease = [0.22, 1, 0.36, 1] as const;

type Clip = { src: string; poster?: string };

// Do video layers: ek chalta hai, doosra tayyar; khatam hone par fade ke saath badal jate hain
function HeroLoop({ clips }: { clips: Clip[] }) {
  const n = clips.length;
  const a = useRef<HTMLVideoElement>(null);
  const b = useRef<HTMLVideoElement>(null);
  const pos = useRef(0);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = [a.current, b.current];
    if (!els[0] || !els[1] || n === 0) return;
    pos.current = 0;
    activeRef.current = 0;
    setActive(0);
    els[0].src = clips[0].src;
    els[0].play().catch(() => {});
    if (n > 1) {
      els[1].src = clips[1].src;
      els[1].load();
    }
  }, [clips, n]);

  // hero screen se bahar ho to pause (CPU bachane ke liye)
  useEffect(() => {
    const el = a.current?.closest("section");
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const cur = [a.current, b.current][activeRef.current];
      if (!cur) return;
      if (e.isIntersecting) cur.play().catch(() => {});
      else cur.pause();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onEnded = (layer: number) => {
    if (n < 2 || layer !== activeRef.current) return;
    const els = [a.current, b.current];
    const other = 1 - layer;
    const next = els[other];
    const old = els[layer];
    if (!next || !old) return;

    pos.current = (pos.current + 1) % n;
    next.currentTime = 0;
    next.play().catch(() => {});
    activeRef.current = other;
    setActive(other);

    // fade khatam hone ke baad, purani layer me agla video tayyar rakho
    const following = clips[(pos.current + 1) % n].src;
    window.setTimeout(() => {
      old.src = following;
      old.load();
    }, 1400);
  };

  const cls = (layer: number) =>
    "absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 " +
    (active === layer ? "opacity-100" : "opacity-0");

  return (
    <>
      <video ref={a} className={cls(0)} muted playsInline preload="auto" poster={clips[0]?.poster} loop={n < 2} onEnded={() => onEnded(0)} />
      <video ref={b} className={cls(1)} muted playsInline preload="auto" onEnded={() => onEnded(1)} />
    </>
  );
}

export default function Hero({ clips, poster }: { clips: Clip[]; poster?: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const ticker = [...services, ...services, ...services];
  const bg = poster ?? clips[0]?.poster;

  return (
    <section
      id="home"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-gradient-to-br from-card1 via-ink to-card2"
    >
      <motion.div style={{ y }} className="absolute inset-x-0 top-0 h-[115%]">
        {bg && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(" + bg + ")" }} />}
        {clips.length > 0 && <HeroLoop clips={clips} />}
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/75 via-ink/25 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-6 pt-20 md:pb-8 md:pt-24">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4, ease }}
          className="text-xs font-medium uppercase tracking-[0.4em] text-gold"
        >
          Avsar Caterers
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.5, ease }}
          style={{ fontSize: "clamp(2.25rem, min(7vw, 9.5vh), 4.5rem)" }}
          className="mt-4 max-w-4xl font-serif leading-[1.08] text-white"
        >
          Premium Catering for <span className="text-gold">Weddings &amp; Celebrations</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.65, ease }}
          style={{ fontSize: "clamp(1.05rem, min(2.4vw, 3.6vh), 1.9rem)" }}
          className="mt-3 font-serif italic text-white/90"
        >
          More Than Catering. We Create Experiences.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.75, ease }}
          className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base md:text-lg [@media(max-height:700px)]:hidden"
        >
          Create memorable celebrations through exceptional food, elegant presentation,
          professional hospitality and customized event experiences.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.85, ease }}
          className="mt-6 flex flex-col gap-3 sm:flex-row"
        >
          <Link href="#quote" className="group btn-primary px-8 py-4 text-sm tracking-wider">
            PLAN YOUR EVENT
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full border border-white/40 px-8 py-4 text-sm font-semibold tracking-wider text-white transition-colors hover:border-gold hover:text-gold"
          >
            WHATSAPP US
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/80"
        >
          <span className="inline-flex items-center gap-2">
            <MapPin size={15} className="text-gold" /> {business.location.display}
          </span>
          <a href={business.phoneLink} className="inline-flex items-center gap-2 hover:text-gold">
            <Phone size={15} className="text-gold" /> {business.phone}
          </a>
        </motion.div>
      </div>

      <div className="pointer-events-none absolute bottom-16 right-6 hidden md:block" aria-hidden>
        <ChevronDown className="animate-bounce text-gold/70" />
      </div>

      <div className="relative overflow-hidden border-t border-gold/20 bg-ink/70 py-3.5 backdrop-blur md:py-4">
        <div className="animate-marquee flex w-max gap-10 whitespace-nowrap">
          {ticker.map((s, i) => (
            <span key={s.id + i} className="flex items-center gap-10 text-[11px] uppercase tracking-[0.3em] text-white/60 md:text-xs">
              {s.title}
              <span className="text-gold">&#9670;</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}