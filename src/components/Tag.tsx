import Link from "next/link";

export function Tag({
  children,
  href,
  accent = false,
}: {
  children: React.ReactNode;
  href?: string;
  accent?: boolean;
}) {
  const className = accent ? "tag-accent" : "tag";
  if (href) {
    return (
      <Link href={href} className={`${className} hover:bg-ink-200`}>
        {children}
      </Link>
    );
  }
  return <span className={className}>{children}</span>;
}

export function TagList({
  items,
  hrefFor,
  accent = false,
  max,
}: {
  items: string[];
  hrefFor?: (item: string) => string;
  accent?: boolean;
  max?: number;
}) {
  const shown = max ? items.slice(0, max) : items;
  const extra = max ? items.length - shown.length : 0;
  return (
    <div className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <Tag key={item} accent={accent} href={hrefFor?.(item)}>
          {item}
        </Tag>
      ))}
      {extra > 0 && <span className="tag">+{extra}</span>}
    </div>
  );
}
