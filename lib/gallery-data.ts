import fs from "node:fs";
import path from "node:path";
import sizeOf from "image-size";
import { labelFor, type PhotoItem, type VideoItem } from "./gallery-config";
import { hiddenPhotos, hiddenVideos } from "./gallery-hidden";
import { featuredPhotos, featuredVideos } from "./gallery-order";

const IMG = /\.(jpe?g|jfif|png|webp|avif|gif)$/i;
const VID = /\.(mp4|m4v|webm|mov|ogv)$/i;
const collator = new Intl.Collator("en", { numeric: true });

const stripExt = (s: string) => s.replace(/\.[^.]+$/, "").toLowerCase();
const toSet = (list: string[]) => new Set(list.map(stripExt));

function readSize(file: string) {
  let width = 1200;
  let height = 1500;
  try {
    const d = sizeOf(file);
    if (d.width && d.height) {
      const rotated = d.orientation && d.orientation >= 5;
      width = rotated ? d.height : d.width;
      height = rotated ? d.width : d.height;
    }
  } catch {
    // keep defaults
  }
  return { width, height };
}

// pehli item wahi rahe; uske baad featured list ke order me; phir baaki
function applyOrder<T>(items: T[], nameOf: (i: T) => string, pinned: string[]): T[] {
  if (items.length < 2 || pinned.length === 0) return items;
  const [first, ...rest] = items;
  const rank = new Map(pinned.map((n, i) => [stripExt(n), i]));
  const key = (i: T) => stripExt(nameOf(i));
  const feat = rest.filter((i) => rank.has(key(i))).sort((a, b) => (rank.get(key(a)) as number) - (rank.get(key(b)) as number));
  const others = rest.filter((i) => !rank.has(key(i)));
  return [first, ...feat, ...others];
}

// Photos: public/photos/gallery/
export function getPhotos(): PhotoItem[] {
  const root = path.join(process.cwd(), "public", "photos", "gallery");
  if (!fs.existsSync(root)) return [];
  const hidden = toSet(hiddenPhotos);
  const items: PhotoItem[] = [];

  const add = (dir: string, urlBase: string, category: string) => {
    const files = fs
      .readdirSync(dir)
      .filter((f) => IMG.test(f) && !hidden.has(stripExt(f)))
      .sort(collator.compare);
    for (const file of files) {
      const { width, height } = readSize(path.join(dir, file));
      items.push({
        id: urlBase + "/" + file,
        src: urlBase + "/" + encodeURIComponent(file),
        alt: (category ? labelFor(category) + " " : "") + "event photo by Avsar Caterers",
        category,
        width,
        height,
      });
    }
  };

  add(root, "/photos/gallery", "");
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    if (entry.isDirectory()) add(path.join(root, entry.name), "/photos/gallery/" + entry.name, entry.name);
  }
  return applyOrder(items, (i) => i.id.split("/").pop() ?? "", featuredPhotos);
}

// Videos: public/videos/gallery/ ; cover photo (same naam .jpg) se vertical/landscape pata chalta hai
export function getVideos(): VideoItem[] {
  const dir = path.join(process.cwd(), "public", "videos", "gallery");
  if (!fs.existsSync(dir)) return [];
  const hidden = toSet(hiddenVideos);
  const all = fs.readdirSync(dir);
  const files = all.filter((f) => VID.test(f) && !hidden.has(stripExt(f))).sort(collator.compare);

  const items = files.map((file) => {
    const base = file.replace(/\.[^.]+$/, "");
    const posterFile = all.find((f) => IMG.test(f) && stripExt(f) === base.toLowerCase());
    const title = base.replace(/[-_ ]?(vertical|reel)/i, "").replace(/[-_]+/g, " ");

    let vertical = /reel|vertical/i.test(file);
    if (posterFile) {
      try {
        const d = sizeOf(path.join(dir, posterFile));
        if (d.width && d.height) vertical = d.height > d.width;
      } catch {
        // name se hi decide
      }
    }
    return {
      id: file,
      src: "/videos/gallery/" + encodeURIComponent(file),
      poster: posterFile ? "/videos/gallery/" + encodeURIComponent(posterFile) : undefined,
      title,
      vertical,
    };
  });
  return applyOrder(items, (i) => i.id, featuredVideos);
}