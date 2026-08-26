import { initials } from "@/lib/format";

const SIZES = {
  sm: "h-9 w-9 text-[11px]",
  md: "h-11 w-11 text-xs",
  lg: "h-20 w-20 text-2xl",
} as const;

/** Deterministic gradient per person so avatars stay recognisable without photos. */
const GRADIENTS = [
  "from-amber-200 to-amber-400 text-amber-900",
  "from-accent-200 to-accent-400 text-accent-900",
  "from-emerald-200 to-emerald-400 text-emerald-900",
  "from-rose-200 to-rose-400 text-rose-900",
  "from-sky-200 to-sky-400 text-sky-900",
  "from-violet-200 to-violet-400 text-violet-900",
];

function gradientFor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) % 997;
  return GRADIENTS[hash % GRADIENTS.length];
}

export function Avatar({
  name,
  photo,
  size = "md",
}: {
  name: string;
  photo?: string | null;
  size?: keyof typeof SIZES;
}) {
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={photo}
        alt={name}
        className={`${SIZES[size]} shrink-0 rounded-full object-cover ring-2 ring-white`}
      />
    );
  }
  return (
    <div
      aria-hidden
      className={`${SIZES[size]} grid shrink-0 place-items-center rounded-full bg-gradient-to-br font-display font-semibold shadow-soft ring-2 ring-white ${gradientFor(name)}`}
    >
      {initials(name)}
    </div>
  );
}
