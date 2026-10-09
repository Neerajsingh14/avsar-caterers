import Link from "next/link";
import SafeImage from "@/components/ui/SafeImage";
import Reveal from "@/components/ui/Reveal";

const highlights = [
  "Weddings",
  "Receptions",
  "Engagement Functions",
  "Live Food Counters",
  "Premium Hospitality",
  "Selected events outside Rajasthan",
];

export default function About() {
  return (
    <section id="about" className="bg-ink py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <div className="relative">
            <div className="absolute -bottom-4 -right-4 h-full w-full rounded-3xl border border-gold/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--color-card1)] to-coal">
              {/* public/photos/about/about.jpg */}
              <SafeImage
                src="/photos/about/about.jpg"
                alt="Avsar Caterers at a wedding celebration"
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </Reveal>

        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-12 bg-gold" />
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-gold">About Us</p>
            </div>
            <h2 className="mt-5 font-serif text-4xl leading-tight text-white md:text-5xl">
              More Than Catering. We Create Experiences.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 leading-relaxed text-white/70">
              Avsar Caterers provides catering and hospitality for weddings,
              receptions, engagement functions and traditional celebrations.
              Every event is planned around your guest count, days, functions,
              menu and budget, so the result feels personal rather than standard.
            </p>
            <p className="mt-4 leading-relaxed text-white/70">
              Our team includes experienced hospitality and serving staff,
              including members from Mumbai. We are based in Rajasthan and also
              take selected events outside the state.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {highlights.map((e) => (
                <li key={e} className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
                  {e}
                </li>
              ))}
            </ul>
            <Link href="#quote" className="btn-primary mt-10 px-8 py-4 text-sm tracking-wider">
              GET A CUSTOM QUOTE
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}