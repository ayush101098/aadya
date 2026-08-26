export function SearchBar({
  defaultValue = "",
  placeholder = "Search people, resources, opportunities...",
  size = "md",
  autoFocus = false,
}: {
  defaultValue?: string;
  placeholder?: string;
  size?: "sm" | "md" | "lg";
  autoFocus?: boolean;
}) {
  const height =
    size === "lg" ? "py-3.5 text-[15px]" : size === "sm" ? "py-2 text-sm" : "py-2.5 text-sm";

  return (
    <form action="/search" className="group relative w-full">
      <svg
        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-amber-500"
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        aria-hidden
      >
        <circle cx="9" cy="9" r="6" />
        <path d="m13.5 13.5 4 4" strokeLinecap="round" />
      </svg>
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder={placeholder}
        autoFocus={autoFocus}
        aria-label="Search the cohort"
        className={`w-full rounded-xl border border-ink-200 bg-white pl-10 pr-3 ${height} text-ink-900 shadow-soft outline-none transition-all duration-300 placeholder:text-ink-400 focus:border-amber-300 focus:shadow-lift focus:ring-4 focus:ring-amber-100`}
      />
      {size === "lg" && (
        <span className="pointer-events-none absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-400 sm:block">
          Enter ↵
        </span>
      )}
    </form>
  );
}
