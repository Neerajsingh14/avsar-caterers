"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Loader2, Star } from "lucide-react";
import { eventTypes, reviewSchema, type ReviewInput } from "@/lib/schemas";

export default function ReviewForm({ onDone }: { onDone: () => void }) {
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    mode: "onTouched",
    defaultValues: { name: "", eventType: "", rating: 0, text: "", website: "" },
  });

  const rating = watch("rating");

  const onSubmit = async (values: ReviewInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Something went wrong.");
      setSent(true);
    } catch (e) {
      setServerError(e instanceof Error ? e.message : "Something went wrong.");
    }
  };

  if (sent) {
    return (
      <div className="py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-accent)] to-[var(--color-gold)] text-[var(--color-on-accent)]">
          <Check size={28} strokeWidth={3} />
        </div>
        <h3 className="mt-5 font-serif text-2xl text-white">Thank you!</h3>
        <p className="mt-2 text-sm text-white/65">
          Your review has been sent to our team. It will appear on the website after approval.
        </p>
        <button onClick={onDone} className="btn-primary mt-6 px-7 py-3 text-sm">
          Close
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
        {...register("website")}
      />

      <label className="block">
        <span className="mb-2 block text-sm text-white/80">Your name *</span>
        <input type="text" placeholder="Enter your name" aria-invalid={!!errors.name} className="field" {...register("name")} />
        {errors.name && <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">{errors.name.message}</span>}
      </label>

      <label className="block">
        <span className="mb-2 block text-sm text-white/80">Event type *</span>
        <select aria-invalid={!!errors.eventType} className="field" {...register("eventType")}>
          <option value="">Select event type</option>
          {eventTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        {errors.eventType && <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">{errors.eventType.message}</span>}
      </label>

      <div>
        <span className="mb-2 block text-sm text-white/80">Your rating *</span>
        <div role="radiogroup" aria-label="Rating" className="flex gap-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={n + " star" + (n > 1 ? "s" : "")}
              onClick={() => setValue("rating", n, { shouldValidate: true })}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star size={30} className={n <= rating ? "fill-[var(--color-gold)] text-[var(--color-gold)]" : "text-white/30"} />
            </button>
          ))}
        </div>
        {errors.rating && <span role="alert" className="mt-1 block text-xs text-[#ff8a6b]">{errors.rating.message}</span>}
      </div>

      <label className="block">
        <span className="mb-2 block text-sm text-white/80">Your review *</span>
        <textarea rows={4} placeholder="Tell us about your experience with Avsar Caterers" aria-invalid={!!errors.text} className="field resize-none" {...register("text")} />
        {errors.text && <span role="alert" className="mt-1.5 block text-xs text-[#ff8a6b]">{errors.text.message}</span>}
      </label>

      {serverError && (
        <p role="alert" className="rounded-xl border border-[#ff8a6b]/40 bg-[#ff8a6b]/10 px-4 py-3 text-sm text-[#ffb09a]">
          {serverError}
        </p>
      )}

      <button type="submit" disabled={isSubmitting} className="btn-primary px-8 py-3.5 text-sm">
        {isSubmitting && <Loader2 size={16} className="animate-spin" />}
        {isSubmitting ? "Sending..." : "Submit Review"}
      </button>
    </form>
  );
}