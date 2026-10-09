"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronRight,
  Home,
  Images,
  Info,
  Menu,
  Phone,
  PhoneCall,
  Sparkles,
  Star,
  UtensilsCrossed,
  X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { business, whatsappLink } from "@/lib/business";
import { navLinks } from "@/lib/nav";

const linkIcons: Record<string, typeof Home> = {
  "#home": Home,
  "#about": Info,
  "#services": UtensilsCrossed,
  "#why-us": Sparkles,
  "#gallery": Images,
  "#reviews": Star,
  "#contact": PhoneCall,
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className={"fixed inset-x-0 top-0 z-40 transition-all duration-500 " + (scrolled ? "border-b border-white/10 bg-ink/80 shadow-lg shadow-black/20 backdrop-blur-lg" : "bg-transparent")}
      >
        <nav aria-label="Main navigation" className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 md:h-[88px]">
          <Link href="#home" aria-label="Avsar Caterers - Home">
            <Logo size="md" />
          </Link>

          <ul className="hidden items-center gap-10 lg:flex">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="group relative block py-3 text-[15px] font-medium tracking-wide text-white/80 transition-colors hover:text-gold">{l.label}<span className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100" /></Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link href="#quote" className="btn-primary hidden px-7 py-3.5 text-sm lg:inline-flex">Book Catering</Link>
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-ink/40 text-white backdrop-blur lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              data-lenis-prevent
              className="absolute right-3 top-3 flex max-h-[calc(100%-1.5rem)] w-[88%] max-w-[330px] flex-col overflow-y-auto rounded-3xl border border-gold/25 bg-ink shadow-2xl shadow-black/60"
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/15 blur-3xl" />

              {/* header */}
              <div className="relative flex h-[60px] shrink-0 items-center justify-between px-4">
                <Logo size="sm" />
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
                >
                  <X size={17} />
                </button>
              </div>
              <div className="mx-4 h-px bg-gradient-to-r from-gold/40 via-white/10 to-transparent" />

              {/* links: one by one, full-width rows */}
              <nav aria-label="Mobile navigation" className="relative px-2 py-2">
                <ul>
                  {navLinks.map((l, i) => {
                    const Icon = linkIcons[l.href] ?? Info;
                    const last = i === navLinks.length - 1;
                    return (
                      <motion.li
                        key={l.href}
                        initial={{ opacity: 0, x: 18 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + i * 0.04, duration: 0.3 }}
                        className={last ? "" : "border-b border-white/[0.07]"}
                      >
                        <Link
                          href={l.href}
                          onClick={() => setOpen(false)}
                          className="group flex w-full items-center gap-3 rounded-xl px-3 py-[11px] transition-colors hover:bg-white/[0.06]"
                        >
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gold transition-colors group-hover:border-gold/50 group-hover:bg-gold/10">
                            <Icon size={16} strokeWidth={1.7} />
                          </span>
                          <span className="flex-1 text-[14px] font-medium text-white/90 transition-colors group-hover:text-gold">
                            {l.label}
                          </span>
                          <ChevronRight size={15} className="text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
                        </Link>
                      </motion.li>
                    );
                  })}
                </ul>
              </nav>

              {/* actions */}
              <div className="relative border-t border-white/10 bg-white/[0.02] px-4 pb-4 pt-3.5">
                <Link href="#quote" onClick={() => setOpen(false)} className="btn-primary flex w-full py-3 text-[12px] tracking-[0.15em]">
                  BOOK CATERING
                </Link>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  <a href={business.phoneLink} className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-gold hover:text-gold">
                    <Phone size={14} /> Call
                  </a>
                  <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 rounded-full border border-white/15 py-2.5 text-[13px] font-medium text-white transition-colors hover:border-gold hover:text-gold">
                    <WhatsAppIcon size={14} /> WhatsApp
                  </a>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}