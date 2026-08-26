import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { one, type SearchParams } from "@/lib/params";

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = one(params, "next") ?? "/";

  return (
    <div className="relative w-full max-w-sm animate-fade-up">
      <Link href="/" className="mb-8 flex items-center gap-2 text-ink-400 hover:text-ink-200">
        <span aria-hidden>←</span>
        <span className="text-xs tracking-wide">Back to Beer &amp; Books</span>
      </Link>

      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 text-lg shadow-glow">
          📚
        </span>
        <h1 className="font-display text-2xl tracking-tight text-white">
          Beer <span className="text-amber-300">&amp;</span> Books
        </h1>
      </div>
      <p className="mt-3 text-sm text-ink-400">
        Private to our cohort — people, resources, opportunities and help. Sign in with the email
        your admin added.
      </p>

      <div className="glass mt-7 p-5">
        {isSupabaseConfigured ? (
          <LoginForm next={next} />
        ) : (
          <div className="space-y-3 text-sm text-ink-300">
            <p className="font-semibold text-white">Running in demo mode.</p>
            <p>
              No Supabase keys are set, so the app is using seed data and login is skipped. Add
              <code className="mx-1 rounded bg-white/10 px-1 text-amber-200">NEXT_PUBLIC_SUPABASE_URL</code>
              and
              <code className="mx-1 rounded bg-white/10 px-1 text-amber-200">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
              to <code className="rounded bg-white/10 px-1 text-amber-200">.env.local</code> to switch on real
              authentication.
            </p>
            <Link href="/home" className="btn-amber w-full">
              Enter the demo <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
