import fs from "node:fs";
import path from "node:path";
import { heroPlaylist } from "./hero-config";
import { getHero } from "./media";

const IMG = /\.(jpe?g|jfif|png|webp|avif|gif)$/i;
const VID = /\.(mp4|m4v|webm|mov|ogv)$/i;
const strip = (f: string) => f.replace(/\.[^.]+$/, "");

export type HeroClip = { src: string; poster?: string };

export function getHeroClips(): HeroClip[] {
  const rel = ["videos", "gallery"];
  let files: string[] = [];
  try {
    files = fs.readdirSync(path.join(process.cwd(), "public", ...rel));
  } catch {
    // folder missing
  }
  const url = (f: string) => "/" + rel.join("/") + "/" + encodeURIComponent(f);

  const clips: HeroClip[] = [];
  for (const name of heroPlaylist) {
    const n = name.toLowerCase();
    // "Video7" -> Video7.mp4, Video7-vertical.mp4 (Video70 match nahi hota)
    const v = files.find((f) => {
      if (!VID.test(f)) return false;
      const b = strip(f).toLowerCase();
      return b === n || (b.startsWith(n) && /^[-_ ]?(vertical|reel|converted)/.test(b.slice(n.length)));
    });
    if (!v) {
      console.warn("[hero] video nahi mila: " + name);
      continue;
    }
    const p = files.find((f) => IMG.test(f) && strip(f).toLowerCase() === strip(v).toLowerCase());
    clips.push({ src: url(v), poster: p ? url(p) : undefined });
  }

  if (clips.length) return clips;
  const h = getHero();
  return h.video ? [{ src: h.video, poster: h.poster }] : [];
}