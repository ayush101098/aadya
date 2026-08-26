import { switchDemoUser } from "@/app/actions";
import type { Person } from "@/lib/types";

export function DemoBanner({ people, current }: { people: Person[]; current: Person }) {
  return (
    <div className="border-b border-amber-300/50 bg-gradient-to-r from-amber-100 via-amber-50 to-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-3 gap-y-1 px-4 py-1.5 text-xs text-amber-900">
        <span className="font-semibold">Demo mode</span>
        <span className="hidden sm:inline">
          Seed data in memory, no login. Add Supabase keys to <code>.env.local</code> to go live.
        </span>
        <form action={switchDemoUser} className="ml-auto flex items-center gap-1.5">
          <label htmlFor="demo-user" className="hidden sm:inline">
            Viewing as
          </label>
          <select
            id="demo-user"
            name="userId"
            defaultValue={current.id}
            className="rounded border border-amber-300 bg-white px-1.5 py-0.5 text-xs"
          >
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
                {p.role === "admin" ? " (admin)" : ""}
              </option>
            ))}
          </select>
          <button type="submit" className="rounded border border-amber-300 bg-white px-2 py-0.5 font-medium">
            Switch
          </button>
        </form>
      </div>
    </div>
  );
}
