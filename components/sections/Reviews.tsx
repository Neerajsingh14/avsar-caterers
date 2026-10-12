import ReviewsClient from "./ReviewsClient";
import { getReviews } from "@/lib/reviews";

export default async function Reviews() {
  const reviews = await getReviews();
  return <ReviewsClient reviews={reviews} />;
}