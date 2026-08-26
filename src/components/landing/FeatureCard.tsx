import Link from "next/link";

export function FeatureCard({
  eyebrow,
  title,
  body,
  points,
  href,
  icon,
}: {
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  href: string;
  icon: string;
}) {
  return (
    <Link href={href} className="glass glass-hover group relative block overflow-hidden p-6">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-amber-400/10 blur-2xl transition-all duration-700 group-hover:bg-amber-400/20"
      />
      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/[0.05] text-base">
            {icon}
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[.18em] text-amber-300/80">
            {eyebrow}
          </span>
        </div>
        <h3 className="mt-4 font-display text-xl text-ink-50">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{body}</p>
        <ul className="mt-4 space-y-1.5">
          {points.map((point) => (
            <li key={point} className="flex items-start gap-2 text-sm text-ink-300">
              <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-amber-300" />
              {point}
            </li>
          ))}
        </ul>
        <span className="mt-5 inline-flex items-center gap-1 text-xs font-semibold text-amber-300 transition-all group-hover:gap-2">
          Open <span aria-hidden>→</span>
        </span>
      </div>
    </Link>
  );
}
