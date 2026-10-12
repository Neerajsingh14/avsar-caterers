import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Check, Star } from "lucide-react";
import { verifyToken } from "@/lib/review-token";
import { githubConfig, updateReviews } from "@/lib/github-reviews";
import { getReviews } from "@/lib/reviews";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Remove review", robots: { index: false, follow: false } };

async function removeReview(formData: FormData) {
  "use server";
  const d = String(formData.get("d") ?? "");
  const s = String(formData.get("s") ?? "");
  const back = "/remove-review?d=" + encodeURIComponent(d) + "&s=" + encodeURIComponent(s);
  const p = verifyToken(d, s);
  if (!p || !githubConfig()) redirect(back + "&status=invalid");

  let status = "removed";
  try {
    const res = await updateReviews((list) => {
      if (!list.some((r) => r.id === p.id)) return null;
      return list.filter((r) => r.id !== p.id);
    }, "Remove review " + p.id);
    status = res === "ok" ? "removed" : "gone";
    revalidatePath("/");
  } catch (e) {
    console.error(e);
    status = "error";
  }
  redirect(back + "&status=" + status);
}

const shell = "flex min-h-screen items-center justify-center bg-ink px-5 py-16 text-white";
const card = "w-full max-w-lg rounded-3xl border border-white/10 bg-gradient-to-br from-card1 to-card2 p-7 md:p-9";

export default async function RemoveReviewPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string; s?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const p = verifyToken(sp.d, sp.s);

  if (!p) {
    return (
      <main className={shell}>
        <div className={card + " text-center"}>
          <h1 className="font-serif text-2xl">This link is not valid</h1>
          <p className="mt-3 text-sm text-white/65">The link may be incomplete or too old. Please use the button in the original email.</p>
          <Link href="/" className="btn-primary mt-7 px-7 py-3 text-sm">Back to website</Link>
        </div>
      </main>
    );
  }

  if (sp.status === "removed" || sp.status === "gone") {
    return (
      <main className={shell}>
        <div className={card + " text-center"}>
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-gold text-[var(--color-on-accent)]">
            <Check size={28} strokeWidth={3} />
          </div>
          <h1 className="mt-5 font-serif text-2xl">{sp.status === "gone" ? "Already removed" : "Review removed"}</h1>
          <p className="mt-3 text-sm text-white/65">It will disappear from the website within a minute.</p>
          <Link href="/" className="btn-primary mt-7 px-7 py-3 text-sm">Back to website</Link>
        </div>
      </main>
    );
  }

  const review = (await getReviews()).find((r) => r.id === p.id);

  if (!review) {
    return (
      <main className={shell}>
        <div className={card + " text-center"}>
          <h1 className="font-serif text-2xl">Review not found</h1>
          <p className="mt-3 text-sm text-white/65">It may already be removed.</p>
          <Link href="/" className="btn-primary mt-7 px-7 py-3 text-sm">Back to website</Link>
        </div>
      </main>
    );
  }

  return (
    <main className={shell}>
      <div className={card}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Remove review</p>
        <h1 className="mt-3 font-serif text-2xl">Remove this review from the website?</h1>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
          <p className="font-serif text-xl">{review.name}</p>
          <p className="mt-1 text-sm text-gold">{review.eventType}</p>
          <div className="mt-3 flex gap-0.5" aria-label={review.rating + " out of 5 stars"}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Star key={n} size={18} className={n <= review.rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-white/25"} />
            ))}
          </div>
          <p className="mt-4 whitespace-pre-line leading-relaxed text-white/80">&ldquo;{review.text}&rdquo;</p>
        </div>

        {sp.status === "error" && (
          <p role="alert" className="mt-5 rounded-xl border border-[#ff8a6b]/40 bg-[#ff8a6b]/10 px-4 py-3 text-sm text-[#ffb09a]">
            Could not remove it right now. Please try again in a minute.
          </p>
        )}
        {sp.status === "invalid" && (
          <p role="alert" className="mt-5 rounded-xl border border-[#ff8a6b]/40 bg-[#ff8a6b]/10 px-4 py-3 text-sm text-[#ffb09a]">
            Removing is not set up on this site yet. Please contact the developer.
          </p>
        )}

        <form action={removeReview} className="mt-6 flex flex-wrap items-center gap-3">
          <input type="hidden" name="d" value={sp.d} />
          <input type="hidden" name="s" value={sp.s} />
          <button type="submit" className="rounded-full bg-[#b3261e] px-8 py-3.5 text-sm font-semibold text-white transition-opacity hover:opacity-90">Yes, remove it</button>
          <Link href="/" className="rounded-full border border-white/20 px-7 py-3.5 text-sm text-white transition-colors hover:border-gold">Keep it</Link>
        </form>
      </div>
    </main>
  );
}