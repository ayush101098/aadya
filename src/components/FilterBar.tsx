"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type FilterDef = {
  name: string;
  label: string;
  options: readonly string[];
};

export function FilterBar({
  filters,
  placeholder = "Search...",
  resultCount,
}: {
  filters: FilterDef[];
  placeholder?: string;
  resultCount?: number;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setParam = useCallback(
    (name: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      if (value) next.set(name, value);
      else next.delete(name);
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [params, pathname, router],
  );

  const active = filters.some((f) => params.get(f.name)) || params.get("q");

  return (
    <div className="card p-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="search"
          defaultValue={params.get("q") ?? ""}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(e) => setParam("q", e.target.value)}
          className="input sm:max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <select
              key={filter.name}
              value={params.get(filter.name) ?? ""}
              onChange={(e) => setParam(filter.name, e.target.value)}
              aria-label={filter.label}
              className={`rounded-md border px-2 py-2 text-sm outline-none focus:border-accent-400 ${
                params.get(filter.name)
                  ? "border-accent-300 bg-accent-50 text-accent-800"
                  : "border-ink-200 bg-white text-ink-700"
              }`}
            >
              <option value="">{filter.label}</option>
              {filter.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ))}
        </div>
        <div className="flex items-center gap-3 sm:ml-auto">
          {typeof resultCount === "number" && (
            <span className="whitespace-nowrap text-xs text-ink-500">{resultCount} results</span>
          )}
          {active && (
            <button
              type="button"
              onClick={() => router.replace(pathname, { scroll: false })}
              className="whitespace-nowrap text-xs font-medium text-accent-700 hover:text-accent-800"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
