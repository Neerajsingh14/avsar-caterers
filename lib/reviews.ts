export type Review = {
  id: string;
  name: string;
  eventType: string;
  rating: number; // 1-5
  text: string;
  sample?: boolean; // remove this line for real reviews
};

// Real client reviews yahan add karo (sample: true wali lines delete kar do).
export const reviews: Review[] = [
  {
    id: "sample-1",
    name: "Sample Client",
    eventType: "Wedding",
    rating: 5,
    text: "This is a sample review card. Replace it with a real client review in lib/reviews.ts.",
    sample: true,
  },
  {
    id: "sample-2",
    name: "Sample Client",
    eventType: "Reception",
    rating: 5,
    text: "This is a sample review card. Real reviews approved by Avsar Caterers will appear here.",
    sample: true,
  },
  {
    id: "sample-3",
    name: "Sample Client",
    eventType: "Engagement Function",
    rating: 5,
    text: "This is a sample review card. Add genuine client feedback to replace these placeholders.",
    sample: true,
  },
];