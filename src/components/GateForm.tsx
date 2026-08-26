"use client";

import { useActionState } from "react";
import { signInAction, type ActionState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";

export function GateForm({ next, adminOnly }: { next: string; adminOnly: boolean }) {
  const [state, action] = useActionState<ActionState, FormData>(signInAction, {});

  return (
    <form action={action} className="space-y-3">
      <input type="hidden" name="next" value={next} />

      <label className="block space-y-1">
        <span className="label text-ink-400">ISB email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="Firstname_Lastname_PGPPRO2027@isb.edu"
          className="input border-white/12 bg-white/[0.06] text-white shadow-none placeholder:text-ink-500 focus:border-amber-300/60 focus:ring-amber-300/20"
        />
      </label>

      <label className="block space-y-1">
        <span className="label text-ink-400">Access code</span>
        <input
          type="password"
          name="code"
          required
          autoComplete="current-password"
          placeholder="Shared with the cohort"
          className="input border-white/12 bg-white/[0.06] text-white shadow-none placeholder:text-ink-500 focus:border-amber-300/60 focus:ring-amber-300/20"
        />
      </label>

      {state.error && <p className="text-sm text-rose-300">{state.error}</p>}

      <SubmitButton className="btn-amber w-full" pendingLabel="Checking...">
        Enter
      </SubmitButton>

      <p className="text-xs text-ink-500">
        {adminOnly
          ? "Setup mode — only admins can sign in right now."
          : "PGP PRO 2027 only. Your email has to be on the cohort roster."}
      </p>
    </form>
  );
}
