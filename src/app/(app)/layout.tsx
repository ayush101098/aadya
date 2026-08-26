import { NavBar } from "@/components/NavBar";
import { DemoBanner } from "@/components/DemoBanner";
import { getCurrentUser } from "@/lib/auth";
import { loadPeople } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const people = isSupabaseConfigured ? [] : await loadPeople();

  return (
    <div className="relative min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(79,99,245,.10),transparent_70%),radial-gradient(40%_80%_at_85%_0%,rgba(255,180,32,.12),transparent_70%)]"
      />
      {!isSupabaseConfigured && user && <DemoBanner people={people} current={user} />}
      {user && (
        <NavBar userName={user.name} userPhoto={user.photo} isAdmin={user.role === "admin"} />
      )}
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:pb-16">{children}</main>
      <footer className="mx-auto max-w-6xl px-4 pb-24 pt-4 text-xs text-ink-400 sm:pb-8">
        Beer &amp; Chill — built by the cohort, for the cohort. Not a replacement for official
        placement services.
      </footer>
    </div>
  );
}
