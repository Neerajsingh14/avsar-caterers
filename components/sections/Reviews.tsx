"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, PenLine, Star, X } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ReviewForm from "@/components/forms/ReviewForm";
import { reviews } from "@/lib/reviews";

function Stars({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={value + " out of 5 stars"}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= value ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-white/25"} />
      ))}
    </div>
  );
}

export default function Reviews() {
  const [open, setOpen] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);

  const real = reviews.filter((r) => !r.sample);
  const list = process.env.NODE_ENV === "production" ? real : reviews;
  const avg = real.length ? real.reduce((s, r) => s + r.rating, 0) / real.length : 0;

  const scroll = (dir: 1 | -1) => {
    const el = scroller.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <section id="reviews" className="bg-coal py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Reviews</p>
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="mt-5 font-serif text-4xl text-white md:text-5xl">
            What Our Clients Say
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-[340px_1fr]">
          {/* Summary card */}
          <Reveal>
            <div className="h-full rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-card1)] to-[var(--color-card2)] p-8">
              {real.length > 0 ? (
                <>
                  <p className="font-serif text-6xl text-white">{avg.toFixed(1)}</p>
                  <div className="mt-2"><Stars value={Math.round(avg)} size={20} /></div>
                  <p className="mt-2 text-sm text-white/60">
                    Based on {real.length} client review{real.length > 1 ? "s" : ""}
                  </p>
                  <div className="mt-6 space-y-2">
                    {[5, 4, 3, 2, 1].map((s) => {
                      const pct = Math.round((real.filter((r) => r.rating === s).length / real.length) * 100);
                      return (
                        <div key={s} className="flex items-center gap-3 text-xs text-white/60">
                          <span className="w-10">{s} star</span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div className="h-full rounded-full bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-gold)]" style={{ width: pct + "%" }} />
                          </div>
                          <span className="w-9 text-right">{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <Stars value={5} size={24} />
                  <h3 className="mt-5 font-serif text-2xl text-white">Share your experience</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">
                    Hosted an event with Avsar Caterers? We would love to hear
                    how it went.
                  </p>
                </>
              )}
              <button onClick={() => setOpen(true)} className="btn-primary mt-8 px-7 py-3.5 text-sm">
                <PenLine size={16} /> Write a Review
              </button>
            </div>
          </Reveal>

          {/* Cards */}
          <Reveal delay={0.1} className="min-w-0">
            <div className="mb-4 flex justify-end gap-2">
              <button onClick={() => scroll(-1)} aria-label="Previous reviews" className="rounded-full border border-white/20 p-2.5 text-white transition-colors hover:border-gold hover:text-gold">
                <ChevronLeft size={18} />
              </button>
              <button onClick={() => scroll(1)} aria-label="Next reviews" className="rounded-full border border-white/20 p-2.5 text-white transition-colors hover:border-gold hover:text-gold">
                <ChevronRight size={18} />
              </button>
            </div>
            <div
              ref={scroller}
              className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {list.map((r) => (
                <article
                  key={r.id}
                  className="w-[85%] shrink-0 snap-start rounded-3xl border border-white/10 bg-ink p-7 sm:w-[48%]"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] font-serif text-lg text-[var(--color-on-accent)]">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate font-medium text-white">{r.name}</h3>
                      <p className="text-xs text-gold">{r.eventType}</p>
                    </div>
                    {r.sample && (
                      <span className="ml-auto rounded-full border border-white/20 px-2.5 py-1 text-[10px] uppercase tracking-wider text-white/50">
                        Sample
                      </span>
                    )}
                  </div>
                  <div className="mt-4"><Stars value={r.rating} /></div>
                  <p className="mt-4 leading-relaxed text-white/75">&ldquo;{r.text}&rdquo;</p>
                </article>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label="Write a review"
            className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm sm:items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative my-8 w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-[var(--color-card1)] to-[var(--color-card2)] p-7 md:p-9"
            >
              <button onClick={() => setOpen(false)} aria-label="Close" className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
                <X size={18} />
              </button>
              <h3 className="font-serif text-2xl text-white">Write a Review</h3>
              <p className="mb-6 mt-1 text-sm text-white/60">Tell us about your event with Avsar Caterers.</p>
              <ReviewForm onDone={() => setOpen(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}