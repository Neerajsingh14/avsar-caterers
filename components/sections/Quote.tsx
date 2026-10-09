import Reveal from "@/components/ui/Reveal";
import QuoteForm from "@/components/forms/QuoteForm";
import { business } from "@/lib/business";

export default function Quote() {
  return (
    <section id="quote" className="relative overflow-hidden bg-coal py-20 md:py-28">
      <div aria-hidden className="pointer-events-none absolute -right-40 top-0 h-[480px] w-[480px] rounded-full bg-[var(--color-accent)]/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[var(--color-gold)]/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        <Reveal>
          <div className="flex items-center gap-3">
            <span className="h-px w-12 bg-gold" />
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">Get a Quote</p>
          </div>
          <h2 className="mt-5 font-serif text-4xl leading-[1.1] text-white md:text-6xl">
            Tell us about your event.
          </h2>
          <p className="mt-5 max-w-md leading-relaxed text-white/65">
            Share your guest count and contact details. Every event receives a
            customized quotation based on your requirements and budget, and our
            team will get in touch with menu ideas.
          </p>
          <p className="mt-6 text-sm text-white/50">
            Prefer to talk? Call {business.owner} on{" "}
            <a href={business.phoneLink} className="text-gold hover:underline">
              {business.phone}
            </a>
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <QuoteForm />
        </Reveal>
      </div>
    </section>
  );
}