"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState(false);
  const [hover, setHover] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 140, damping: 20, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 140, damping: 20, mass: 0.5 });

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const t = e.target as HTMLElement | null;
      setHover(!!t?.closest?.("a, button, [role='button'], [role='radio'], input, select, textarea, label, summary"));
    };
    const leave = () => setVisible(false);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[250] hidden md:block">
      <motion.div style={{ x: rx, y: ry }} className="absolute left-0 top-0">
        <div
          className={
            "-ml-4 -mt-4 h-8 w-8 rounded-full border border-[var(--color-gold)]/70 transition-all duration-300 " +
            (hover ? "scale-[1.6] bg-[var(--color-gold)]/15 " : "scale-100 ") +
            (visible ? "opacity-100" : "opacity-0")
          }
          style={{
            boxShadow: "0 0 14px rgba(245,199,109,0.3)",
            background: hover
              ? undefined
              : "radial-gradient(circle, rgba(245,199,109,0.35) 0%, rgba(245,199,109,0) 65%)",
          }}
        />
      </motion.div>
      <motion.div style={{ x, y }} className="absolute left-0 top-0">
        <div
          className={
            "-ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-[var(--color-gold)] transition-opacity duration-300 " +
            (visible ? "opacity-100" : "opacity-0")
          }
        />
      </motion.div>
    </div>
  );
}