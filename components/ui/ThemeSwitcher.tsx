"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Palette } from "lucide-react";

const KEY = "avsar-theme-v2";

const themes = [
  { id: "gold", name: "Black & Gold", bg: "#080504", fg: "#f5c76d" },
  { id: "ivory", name: "White & Black", bg: "#fbf8f3", fg: "#1c1917" },
  { id: "maroon", name: "Maroon & Gold", bg: "#170409", fg: "#e6c283" },
  { id: "emerald", name: "Emerald & Gold", bg: "#04120d", fg: "#e5c47a" },
];

export default function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState("gold");

  useEffect(() => {
    try {
      const t = localStorage.getItem(KEY);
      if (t && themes.some((x) => x.id === t)) setTheme(t);
    } catch {}
  }, []);

  const pick = (id: string) => {
    setTheme(id);
    if (id === "gold") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = id;
    try { localStorage.setItem(KEY, id); } catch {}
    setOpen(false);
  };

  return (
    <div className="fixed bottom-5 left-4 z-30">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
            className="absolute bottom-14 left-0 w-56 rounded-2xl border border-white/10 bg-ink/95 p-2 shadow-2xl backdrop-blur"
          >
            <p className="px-3 pb-1 pt-2 text-[11px] uppercase tracking-[0.25em] text-gold">Colour theme</p>
            {themes.map((t) => (
              <button key={t.id} onClick={() => pick(t.id)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-white/85 transition-colors hover:bg-white/10">
                <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-white/25" style={{ background: t.bg }}>
                  <span className="absolute inset-y-0 right-0 w-1/2" style={{ background: t.fg }} />
                </span>
                <span className="flex-1">{t.name}</span>
                {theme === t.id && <Check size={16} className="text-gold" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change colour theme"
        aria-expanded={open}
        className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-ink/80 text-gold shadow-lg backdrop-blur transition-colors hover:bg-gold hover:text-[var(--color-on-accent)]"
      >
        <Palette size={19} />
      </button>
    </div>
  );
}