"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const draw = (delay: number) => ({
  initial: { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: { duration: 1.1, delay, ease: "easeInOut" as const },
});

export default function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.body.style.overflow = "";
    }, 1700);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-ink"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" className="h-24 w-24 text-gold md:h-28 md:w-28" aria-hidden="true">
            <motion.path d="M14 33C8.5 32.5 7 25.5 12 23C9.5 17 15 12.5 18 15C19.5 9 28.5 9 30 15C33 12.5 38.5 17 36 23C41 25.5 39.5 32.5 34 33Z" {...draw(0)} />
            <motion.rect x="14" y="33" width="20" height="7" rx="1.6" {...draw(0.35)} />
            <motion.path d="M20 26V33M24 24V33M28 26V33" {...draw(0.7)} />
          </svg>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="font-serif text-4xl tracking-[0.2em] text-white md:text-5xl">AVSAR</p>
            <p className="mt-2 text-xs tracking-[0.6em] text-gold">CATERERS</p>
            <p className="mt-5 text-[11px] uppercase tracking-[0.45em] text-white/50">Rajasthan &middot; India</p>
          </motion.div>

          <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-gold"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}