"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (d: Date) => d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
const fromIso = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
const short = (s: string) =>
  fromIso(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

type Props = {
  start: string;
  end: string;
  onChange: (start: string, end: string) => void;
  error?: string;
};

export default function DateRangePicker({ start, end, onChange, error }: Props) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(() => new Date());
  const [hover, setHover] = useState("");
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(toIso(new Date()));
  }, []);

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

  const openPicker = () => {
    const base = start ? fromIso(start) : new Date();
    setView(new Date(base.getFullYear(), base.getMonth(), 1));
    setOpen(true);
  };

  const cells = useMemo(() => {
    const y = view.getFullYear();
    const m = view.getMonth();
    const lead = new Date(y, m, 1).getDay();
    const days = new Date(y, m + 1, 0).getDate();
    const arr: (string | null)[] = Array(lead).fill(null);
    for (let d = 1; d <= days; d++) arr.push(toIso(new Date(y, m, d)));
    return arr;
  }, [view]);

  const pick = (day: string) => {
    if (!start || end || day < start) {
      onChange(day, "");
      return;
    }
    onChange(start, day);
    setHover("");
    setOpen(false);
  };

  const shift = (n: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + n, 1));
  const monthLabel = view.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const canGoBack = !today || toIso(new Date(view.getFullYear(), view.getMonth(), 1)) > today.slice(0, 8) + "01";

  const previewEnd = end || (start && hover && hover >= start ? hover : "");
  const single = !!start && (!end || end === start);
  const label = !start ? "Select event dates" : single ? short(start) : short(start) + "  \u2192  " + short(end);
  const count = start && end && end !== start
    ? Math.round((fromIso(end).getTime() - fromIso(start).getTime()) / 86400000) + 1
    : start ? 1 : 0;

  return (
    <>
      <button
        type="button"
        onClick={openPicker}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={!!error}
        className="field flex items-center justify-between gap-3 text-left"
      >
        <span className={start ? "text-white" : "text-white/40"}>{label}</span>
        <CalendarDays size={18} className="shrink-0 text-gold" />
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                data-lenis-prevent
                className="fixed inset-0 z-[120] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpen(false)}
              >
                <motion.div
                  role="dialog"
                  aria-modal="true"
                  aria-label="Choose event dates"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 24, scale: 0.97 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onClick={(e) => e.stopPropagation()}
                  className="max-h-[92vh] w-full max-w-[390px] overflow-y-auto rounded-3xl border border-gold/30 bg-gradient-to-br from-card1 to-card2 p-5 shadow-2xl shadow-black/60"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Event dates</p>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close calendar"
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => shift(-1)}
                      disabled={!canGoBack}
                      aria-label="Previous month"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <p className="font-serif text-xl text-white">{monthLabel}</p>
                    <button
                      type="button"
                      onClick={() => shift(1)}
                      aria-label="Next month"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:border-gold hover:text-gold"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-7 text-center text-[11px] uppercase tracking-wider text-white/40">
                    {WEEK.map((w) => (
                      <span key={w} className="py-1">{w}</span>
                    ))}
                  </div>

                  <div className="mt-1 grid grid-cols-7" onMouseLeave={() => setHover("")}>
                    {cells.map((day, i) => {
                      if (!day) return <span key={"b" + i} />;
                      const disabled = !!today && day < today;
                      const isStart = day === start;
                      const isEnd = day === end && end !== start;
                      const inRange = !!start && !!previewEnd && day > start && day < previewEnd;
                      const isToday = day === today;
                      return (
                        <div key={day} className={"flex items-center justify-center py-0.5 " + (inRange ? "bg-gold/15" : "")}>
                          <button
                            type="button"
                            disabled={disabled}
                            onClick={() => pick(day)}
                            onMouseEnter={() => setHover(day)}
                            aria-label={fromIso(day).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                            aria-pressed={isStart || isEnd}
                            className={
                              "flex h-11 w-11 items-center justify-center rounded-full text-sm transition-colors " +
                              (isStart || isEnd
                                ? "bg-gradient-to-br from-accent to-gold font-semibold text-[var(--color-on-accent)]"
                                : disabled
                                ? "cursor-not-allowed text-white/20"
                                : "text-white/90 hover:bg-white/10 " + (isToday ? "ring-1 ring-gold/70" : ""))
                            }
                          >
                            {Number(day.slice(8))}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    <p className="text-center text-xs text-white/60">
                      {!start
                        ? "Tap the first day of your event"
                        : !end
                        ? "Now tap the last day (same date again for a 1-day event)"
                        : count + (count > 1 ? " days selected" : " day selected")}
                    </p>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => { onChange("", ""); setHover(""); }}
                        disabled={!start}
                        className="rounded-full px-4 py-2.5 text-sm text-white/70 transition-colors hover:text-gold disabled:opacity-30"
                      >
                        Clear
                      </button>
                      <button type="button" onClick={() => setOpen(false)} className="btn-primary px-7 py-2.5 text-sm">
                        Done
                      </button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}