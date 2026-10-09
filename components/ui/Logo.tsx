export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M14 33C8.5 32.5 7 25.5 12 23C9.5 17 15 12.5 18 15C19.5 9 28.5 9 30 15C33 12.5 38.5 17 36 23C41 25.5 39.5 32.5 34 33Z" />
      <rect x="14" y="33" width="20" height="7" rx="1.6" />
      <path d="M20 26V33M24 24V33M28 26V33" opacity="0.55" />
    </svg>
  );
}

const sizes = {
  sm: { mark: "h-8 w-8", a: "text-lg", b: "text-[8px]", gap: "gap-2.5" },
  md: { mark: "h-10 w-10", a: "text-2xl", b: "text-[10px]", gap: "gap-3" },
  lg: { mark: "h-14 w-14", a: "text-3xl", b: "text-[11px]", gap: "gap-4" },
} as const;

export default function Logo({ size = "md" }: { size?: keyof typeof sizes }) {
  const s = sizes[size];
  return (
    <span className={"inline-flex items-center leading-none " + s.gap}>
      <LogoMark className={"shrink-0 text-gold " + s.mark} />
      <span className="flex flex-col">
        <span className={"font-serif tracking-[0.18em] text-white " + s.a}>AVSAR</span>
        <span className={"mt-1 tracking-[0.5em] text-gold " + s.b}>CATERERS</span>
      </span>
    </span>
  );
}