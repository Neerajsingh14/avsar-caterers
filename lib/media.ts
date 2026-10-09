import fs from "node:fs";
import path from "node:path";
import sizeOf from "image-size";
import { heroVideoName } from "./hero-config";
import { hiddenVideos } from "./gallery-hidden";

export const IMAGE_RE = /\.(jpe?g|jfif|png|webp|avif|gif)$/i;
export const VIDEO_RE = /\.(mp4|m4v|webm|mov|ogv)$/i;

const collator = new Intl.Collator("en", { numeric: true });

function list(...rel: string[]): string[] {
  try {
    return fs.readdirSync(path.join(process.cwd(), "public", ...rel)).sort(collator.compare);
  } catch {
    return [];
  }
}

const url = (rel: string[], file: string) => "/" + rel.join("/") + "/" + encodeURIComponent(file);
const baseName = (f: string) => f.replace(/\.[^.]+$/, "");
const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

export function firstImage(rel: string[], preferred?: string): string | undefined {
  const files = list(...rel).filter((f) => IMAGE_RE.test(f));
  const pick = (preferred && files.find((f) => norm(baseName(f)) === norm(preferred))) || files[0];
  return pick ? url(rel, pick) : undefined;
}

export function firstVideo(rel: string[], preferred?: string): string | undefined {
  const files = list(...rel).filter((f) => VIDEO_RE.test(f));
  const pick = (preferred && files.find((f) => norm(baseName(f)) === norm(preferred))) || files[0];
  return pick ? url(rel, pick) : undefined;
}

const keywordRules: Record<string, RegExp> = {
  wedding: /wed|shaadi|shadi|vivah|marriage/i,
  reception: /recep/i,
  engagement: /engag|sagai|ring|roka/i,
  counters: /counter|live|food|stall|chaat|paan|pasta|mocktail|icecream/i,
  hospitality: /hosp|staff|serv|waiter|premium/i,
};

export function serviceImages(ids: string[]): Record<string, string> {
  const rel = ["photos", "services"];
  const files = list(...rel).filter((f) => IMAGE_RE.test(f));
  const result: Record<string, string> = {};
  const used = new Set<string>();

  for (const id of ids) {
    const f = files.find((x) => !used.has(x) && norm(baseName(x)) === norm(id));
    if (f) {
      result[id] = url(rel, f);
      used.add(f);
    }
  }
  for (const id of ids) {
    if (result[id]) continue;
    const re = keywordRules[id];
    const f = re && files.find((x) => !used.has(x) && re.test(baseName(x)));
    if (f) {
      result[id] = url(rel, f);
      used.add(f);
    }
  }
  const spare = files.filter((f) => !used.has(f));
  for (const id of ids) {
    if (!result[id] && spare.length) result[id] = url(rel, spare.shift() as string);
  }
  return result;
}

// ---------- hero video ----------
const GAL = ["videos", "gallery"];
const HERO = ["videos", "hero"];

export type HeroOption = { name: string; src: string; poster?: string };

function isLandscape(all: string[], file: string): boolean {
  const b = baseName(file).toLowerCase();
  const p = all.find((f) => IMAGE_RE.test(f) && baseName(f).toLowerCase() === b);
  if (p) {
    try {
      const d = sizeOf(path.join(process.cwd(), "public", ...GAL, p));
      if (d.width && d.height) return d.width >= d.height;
    } catch {
      // name se decide
    }
  }
  return !/vertical|reel/i.test(file);
}

function landscapeVideos(): HeroOption[] {
  const all = list(...GAL);
  const hidden = new Set(hiddenVideos.map((s) => baseName(s).toLowerCase()));
  const out: HeroOption[] = [];
  for (const f of all) {
    const b = baseName(f).toLowerCase();
    if (!VIDEO_RE.test(f) || hidden.has(b) || !isLandscape(all, f)) continue;
    const p = all.find((x) => IMAGE_RE.test(x) && baseName(x).toLowerCase() === b);
    out.push({ name: baseName(f), src: url(GAL, f), poster: p ? url(GAL, p) : undefined });
  }
  return out;
}

function pickHero(land: HeroOption[]): HeroOption | undefined {
  const named = heroVideoName ? land.find((o) => norm(o.name) === norm(heroVideoName)) : undefined;
  return named ?? land[1] ?? land[0];
}

export function getHero(): { video?: string; poster?: string } {
  const own = firstVideo(HERO, "hero");
  if (own) return { video: own, poster: firstImage(HERO, "poster") };
  const cur = pickHero(landscapeVideos());
  if (cur) return { video: cur.src, poster: cur.poster ?? firstImage(HERO, "poster") };
  return { poster: firstImage(HERO, "poster") };
}

// Dev picker ke liye: current + kuch aur options
export function getHeroOptions(max = 5): HeroOption[] {
  if (firstVideo(HERO, "hero")) return [];
  const land = landscapeVideos();
  const cur = pickHero(land);
  if (!cur) return [];
  return [cur, ...land.filter((o) => o !== cur)].slice(0, max);
}