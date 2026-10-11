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
    id: "r20261011165354",
    name: "Neeraj Singh",
    eventType: "Wedding",
    rating: 5,
    text: "Avsar Caterers made our wedding celebration even more special. The food was delicious, the presentation was beautiful, and the arrangements looked wonderful. Our guests truly enjoyed the experience.",
  },
];