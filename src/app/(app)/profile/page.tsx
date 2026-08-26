import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { ProfileEditor } from "@/components/ProfileEditor";
import { signOutAction } from "@/app/actions";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function MyProfilePage() {
  const user = await requireUser();

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink-950">My profile</h1>
          <p className="text-sm text-ink-600">
            The more you fill in, the easier it is for the cohort to find you.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href={`/people/${user.id}`} className="btn-secondary">
            View public profile
          </Link>
          {isSupabaseConfigured && (
            <form action={signOutAction}>
              <button type="submit" className="btn-ghost">
                Sign out
              </button>
            </form>
          )}
        </div>
      </header>

      <ProfileEditor person={user} />
    </div>
  );
}
