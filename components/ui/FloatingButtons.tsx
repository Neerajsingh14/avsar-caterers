"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp } from "lucide-react";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { whatsappLink } from "@/lib/business";

export default function FloatingButtons() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const on = () => setShowTop(window.scrollY > 600);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <div className="fixed bottom-5 right-4 z-30 flex flex-col items-center gap-3">
      <AnimatePresence>
        {showTop && (
          <motion.a
            href="#home"
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.6, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 bg-ink/80 text-gold shadow-lg backdrop-blur transition-colors hover:bg-gold hover:text-[var(--color-on-accent)]"
          >
            <ArrowUp size={20} />
          </motion.a>
        )}
      </AnimatePresence>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-[#ffffff] shadow-lg shadow-black/30 transition-transform hover:scale-110"
      >
        <WhatsAppIcon size={30} />
      </a>
    </div>
  );
}