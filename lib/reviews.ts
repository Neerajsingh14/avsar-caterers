import bundled from "@/data/reviews.json";
import { readRemoteReviews } from "./github-reviews";

export type Review = {
  id: string;
  name: string;
  eventType: string;
  rating: number; // 1-5
  text: string;
  date?: string;
  sample?: boolean;
};

// Sample cards: shown only on your computer, never on the live site.
const samples: Review[] = [
  {
    id: "sample-1",
    name: "Sample Client",
    eventType: "Wedding",
    rating: 5,
    text: "This is a sample review card. Real client reviews will appear here.",
    sample: true,
  },
];

// Newest first. Real reviews come from data/reviews.json (live copy from GitHub when available).
export async function getReviews(): Promise<Review[]> {
  const remote = await readRemoteReviews();
  const list = remote ?? (bundled as unknown as Review[]);
  const real = list.slice().reverse();
  return process.env.NODE_ENV === "production" ? real : [...real, ...samples];
}