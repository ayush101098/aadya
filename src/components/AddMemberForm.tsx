"use client";

import { useActionState } from "react";
import { adminAddMemberAction, type ActionState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import { COHORT_GROUPS, LOCATIONS } from "@/lib/taxonomy";

export function AddMemberForm() {
  const [state, action] = useActionState<ActionState, FormData>(adminAddMemberAction, {});
  return (
    <form action={action} className="card space-y-3 p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block space-y-1">
          <span className="label">Name</span>
          <input name="name" required className="input" />
        </label>
        <label className="block space-y-1">
          <span className="label">Email</span>
          <input name="email" type="email" required className="input" />
        </label>
        <label className="block space-y-1">
          <span className="label">Current role</span>
          <input name="currentRole" className="input" placeholder="MBA Candidate" />
        </label>
        <label className="block space-y-1">
          <span className="label">Background group</span>
          <select name="group" className="input">
            <option value="">—</option>
            {COHORT_GROUPS.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="label">Location</span>
          <select name="location" className="input">
            <option value="">—</option>
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>
        </label>
        <label className="block space-y-1">
          <span className="label">Role</span>
          <select name="role" className="input">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Member added.</p>}
      <SubmitButton pendingLabel="Adding...">Add member</SubmitButton>
    </form>
  );
}
