import Link from "next/link";
import { LoginForm } from "@/components/LoginForm";
import { GateForm } from "@/components/GateForm";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { accessMode } from "@/lib/session";
import { one, type SearchParams } from "@/lib/params";

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const next = one(params, "next") ?? "/home";
  const adminOnly = accessMode() === "admin";

  return (
    <div className="relative w-full max-w-sm animate-fade-up">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-amber-200 to-amber-500 text-lg shadow-glow">
          📚
        </span>
        <h1 className="font-display text-2xl tracking-tight text-white">
          Beer <span className="text-amber-300">&amp;</span> Books
        </h1>
      </div>

      <p className="mt-3 text-sm text-ink-400">
        Private to the ISB PGP PRO 2027 cohort — people, opportunities, resources and help.
      </p>

      {one(params, "denied") === "1" && (
        <p className="mt-5 rounded-lg border border-amber-300/25 bg-amber-300/10 p-3 text-sm text-amber-100">
          The site is in setup mode — only admins can get in until it opens to the batch.
        </p>
      )}

      <div className="glass mt-7 p-5">
        {isSupabaseConfigured ? (
          <LoginForm next={next} />
        ) : (
          <GateForm next={next} adminOnly={adminOnly} />
        )}
      </div>

      {!isSupabaseConfigured && (
        <p className="mt-5 text-xs leading-relaxed text-ink-500">
          Running on the interim access gate. Once Supabase is connected, sign-in becomes a
          one-time link emailed to your ISB address and the code goes away.
        </p>
      )}

      {accessMode() === "cohort" && (
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-xs text-ink-400 hover:text-ink-200">
          <span aria-hidden>←</span> Back to the landing page
        </Link>
      )}
    </div>
  );
}
