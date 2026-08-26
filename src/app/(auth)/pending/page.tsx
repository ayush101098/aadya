import { signOutAction } from "@/app/actions";

export default function PendingPage() {
  return (
    <div className="glass w-full max-w-md p-8 text-center animate-fade-up">
      <h1 className="font-display text-2xl tracking-tight text-white">
        You're signed in, but not on the cohort list yet.
      </h1>
      <p className="mt-3 text-sm text-ink-400">
        An admin needs to add your email before your profile appears. Ping whoever runs the
        platform for your cohort and they can add you in seconds.
      </p>
      <form action={signOutAction} className="mt-6">
        <button type="submit" className="btn border border-white/15 bg-white/[0.05] text-ink-100 hover:bg-white/10">
          Sign out
        </button>
      </form>
    </div>
  );
}
