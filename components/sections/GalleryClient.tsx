"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Maximize2, X } from "lucide-react";
import type { PhotoItem, VideoItem } from "@/lib/gallery-config";

// Shuru me kitne dikhane hain (baaki "down arrow" dabane par)
const INITIAL_PHOTOS = 12;
const INITIAL_VIDEOS = 8;
// Ek saath maximum kitne videos chalein (lag se bachne ke liye)
const MAX_PLAYING = 4;
const playingNow = new Set<string>();

function VideoTile({ v, onOpen }: { v: VideoItem; onOpen: () => void }) {
  const box = useRef<HTMLButtonElement>(null);
  const vid = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const a = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: "250px 0px" });
    const b = new IntersectionObserver(([e]) => setActive(e.intersectionRatio >= 0.5), { threshold: [0, 0.5] });
    a.observe(el);
    b.observe(el);
    return () => {
      a.disconnect();
      b.disconnect();
    };
  }, []);

  // video file tabhi load hoti hai jab screen ke paas aaye
  useEffect(() => {
    const el = vid.current;
    if (!el) return;
    if (near) {
      if (!el.getAttribute("src")) el.src = v.src;
    } else if (el.getAttribute("src")) {
      el.pause();
      el.removeAttribute("src");
      el.load();
    }
  }, [near, v.src]);

  // sirf screen par dikhne par chale, ek saath limited
  useEffect(() => {
    const el = vid.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (near && active && !reduce && (playingNow.has(v.id) || playingNow.size < MAX_PLAYING)) {
      playingNow.add(v.id);
      el.play().catch(() => {});
    } else {
      playingNow.delete(v.id);
      el.pause();
    }
    return () => {
      playingNow.delete(v.id);
    };
  }, [near, active, v.id]);

  return (
    <button
      ref={box}
      onClick={onOpen}
      aria-label={"Open video: " + v.title}
      className={"group relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-card1 to-ink text-left " + (v.vertical ? "col-span-1 aspect-[9/16]" : "col-span-2 aspect-video")}
    >
      <video
        ref={vid}
        poster={v.poster}
        muted
        loop
        playsInline
        preload="none"
        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
        <Maximize2 size={14} />
      </span>
    </button>
  );
}

function MoreButton({
  expanded,
  hidden,
  noun,
  onToggle,
}: {
  expanded: boolean;
  hidden: number;
  noun: string;
  onToggle: () => void;
}) {
  if (!expanded && hidden <= 0) return null;
  return (
    <div className="mt-6 flex justify-center">
      <button onClick={onToggle} className="group flex flex-col items-center gap-2">
        <span className="text-sm text-white/80 transition-colors group-hover:text-gold">
          {expanded ? "Show less" : "View all " + noun + " (" + hidden + " more)"}
        </span>
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 text-gold transition-colors group-hover:bg-gold group-hover:text-[var(--color-on-accent)]">
          {expanded ? <ChevronUp size={22} /> : <ChevronDown size={22} className="animate-bounce" />}
        </span>
      </button>
    </div>
  );
}

type Modal = { kind: "photo" | "video"; index: number } | null;

export default function GalleryClient({ photos, videos }: { photos: PhotoItem[]; videos: VideoItem[] }) {
  const [tab, setTab] = useState<"photos" | "videos">("photos");
  const [open, setOpen] = useState({ photos: false, videos: false });
  const [modal, setModal] = useState<Modal>(null);

  const shownPhotos = open.photos ? photos : photos.slice(0, INITIAL_PHOTOS);
  const shownVideos = open.videos ? videos : videos.slice(0, INITIAL_VIDEOS);

  const toggle = (k: "photos" | "videos") => {
    const wasOpen = open[k];
    setOpen((o) => ({ ...o, [k]: !o[k] }));
    if (wasOpen) document.getElementById("gallery")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const close = useCallback(() => setModal(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setModal((m) => {
        if (!m) return m;
        const len = m.kind === "photo" ? photos.length : videos.length;
        if (!len) return m;
        return { ...m, index: (m.index + dir + len) % len };
      }),
    [photos.length, videos.length]
  );

  useEffect(() => {
    if (!modal) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [modal, close, step]);

  const curPhoto = modal?.kind === "photo" ? photos[modal.index] : null;
  const curVideo = modal?.kind === "video" ? videos[modal.index] : null;
  const total = modal ? (modal.kind === "photo" ? photos.length : videos.length) : 0;
  const navBtn = "absolute hidden rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20 md:block";

  return (
    <section id="gallery" className="bg-coal py-16 md:py-28">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Gallery</p>
            <span className="h-px w-12 bg-gold" />
          </div>
          <h2 className="mt-5 font-serif text-3xl text-white sm:text-4xl md:text-5xl">Moments From Our Events</h2>
          <p className="mt-4 text-white/60">Real photos and videos from weddings, receptions and celebrations.</p>
        </div>

        <div className="mt-9 flex justify-center">
          <div role="tablist" aria-label="Gallery type" className="inline-flex rounded-full border border-white/15 p-1">
            {(["photos", "videos"] as const).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={
                  "rounded-full px-7 py-2.5 text-sm font-medium capitalize transition-colors " +
                  (tab === t ? "bg-gradient-to-r from-accent to-gold text-[var(--color-on-accent)]" : "text-white/70 hover:text-white")
                }
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {tab === "photos" && (
          <>
            <div className="relative mt-8">
              <div className="columns-2 gap-2.5 sm:columns-3 md:gap-3 lg:columns-4">
                {shownPhotos.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "60px" }}
                    transition={{ duration: 0.5 }}
                    onClick={() => setModal({ kind: "photo", index: idx })}
                    aria-label={"Open photo " + (idx + 1)}
                    className="group relative mb-2.5 block w-full overflow-hidden rounded-xl bg-white/5 md:mb-3"
                  >
                    <Image
                      src={item.src}
                      alt={item.alt}
                      width={item.width}
                      height={item.height}
                      loading="lazy"
                      quality={70}
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 280px"
                      className="h-auto w-full transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                    <span className="absolute right-2.5 top-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100">
                      <Maximize2 size={14} />
                    </span>
                  </motion.button>
                ))}
              </div>
              {!open.photos && photos.length > INITIAL_PHOTOS && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-coal to-transparent" />
              )}
            </div>
            <MoreButton expanded={open.photos} hidden={photos.length - INITIAL_PHOTOS} noun="photos" onToggle={() => toggle("photos")} />
            {photos.length === 0 && <p className="mt-10 text-center text-white/60">Event photos will be added soon.</p>}
          </>
        )}

        {tab === "videos" && (
          <>
            <div className="relative mt-8">
              <div className="grid grid-flow-dense grid-cols-2 items-start gap-2.5 sm:grid-cols-3 md:gap-3 lg:grid-cols-5">
                {shownVideos.map((v, i) => (
                  <VideoTile key={v.id} v={v} onOpen={() => setModal({ kind: "video", index: i })} />
                ))}
              </div>
              {!open.videos && videos.length > INITIAL_VIDEOS && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-coal to-transparent" />
              )}
            </div>
            <MoreButton expanded={open.videos} hidden={videos.length - INITIAL_VIDEOS} noun="videos" onToggle={() => toggle("videos")} />
            {videos.length === 0 && <p className="mt-10 text-center text-white/60">Event videos will be added soon.</p>}
          </>
        )}
      </div>

      <AnimatePresence>
        {modal && (curPhoto || curVideo) && (
          <motion.div
            data-lenis-prevent
            role="dialog"
            aria-modal="true"
            aria-label={modal.kind === "photo" ? "Photo viewer" : "Video player"}
            className="theme-fixed fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <button onClick={close} aria-label="Close" className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20">
              <X size={22} />
            </button>

            <button onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Previous" className={navBtn + " left-3"}>
              <ChevronLeft size={26} />
            </button>

            <motion.div
              key={modal.kind + modal.index}
              drag={modal.kind === "photo" ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.4}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80) step(1);
                else if (info.offset.x > 80) step(-1);
              }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center"
            >
              {curPhoto && (
                <div className="relative h-[80vh] w-[92vw] max-w-5xl">
                  <Image src={curPhoto.src} alt={curPhoto.alt} fill sizes="92vw" quality={85} className="object-contain" priority />
                </div>
              )}
              {curVideo && (
                <video
                  src={curVideo.src}
                  poster={curVideo.poster}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[80vh] max-w-[92vw] rounded-xl bg-black"
                />
              )}
            </motion.div>

            <button onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Next" className={navBtn + " right-3"}>
              <ChevronRight size={26} />
            </button>

            <div className="absolute bottom-4 flex items-center gap-4 text-sm text-white/70" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => step(-1)} aria-label="Previous" className="rounded-full bg-white/10 p-2.5 text-white md:hidden">
                <ChevronLeft size={20} />
              </button>
              <span>{modal.index + 1} / {total}</span>
              <button onClick={() => step(1)} aria-label="Next" className="rounded-full bg-white/10 p-2.5 text-white md:hidden">
                <ChevronRight size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}