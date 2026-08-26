export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="mask-fade-x overflow-hidden py-2">
      <div className="flex w-max animate-marquee gap-3">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="whitespace-nowrap rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs text-ink-300"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
