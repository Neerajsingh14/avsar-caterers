export type PhotoItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  width: number;
  height: number;
};

export type VideoItem = {
  id: string;
  src: string;
  poster?: string;
  title: string;
  vertical: boolean;
};

const labels: Record<string, string> = {
  weddings: "Weddings",
  receptions: "Receptions",
  engagements: "Engagements",
  counters: "Counters",
  food: "Food",
  hospitality: "Hospitality",
  events: "Events",
};

export function labelFor(category: string) {
  if (labels[category]) return labels[category];
  const t = category.replace(/[-_]+/g, " ");
  return t.charAt(0).toUpperCase() + t.slice(1);
}