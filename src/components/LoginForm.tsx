"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    const supabase = createSupabaseBrowserClient();
    const redirect = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error: signInError } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      // Anyone can request a link; only emails on the cohort list get past /pending.
      options: { emailRedirectTo: redirect, shouldCreateUser: true },
    });

    if (signInError) {
      setError(signInError.message);
      setStatus("idle");
      return;
    }
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-lg border border-emerald-300/25 bg-emerald-400/10 p-4 text-sm text-emerald-100">
        <p className="font-medium">Check your inbox.</p>
        <p className="mt-1 text-emerald-200/80">
          We sent a sign-in link to <span className="font-medium">{email}</span>. It expires in an
          hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <label className="block space-y-1">
        <span className="label text-ink-400">Cohort email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@cohort.edu"
          className="input border-white/12 bg-white/[0.06] text-white shadow-none placeholder:text-ink-500 focus:border-amber-300/60 focus:ring-amber-300/20"
        />
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button type="submit" disabled={status === "sending"} className="btn-amber w-full">
        {status === "sending" ? "Sending link..." : "Email me a sign-in link"}
      </button>
      <p className="text-xs text-ink-500">
        Only approved cohort members can sign in. No passwords — we email you a one-time link.
      </p>
    </form>
  );
}
