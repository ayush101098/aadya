"use client";

import { useActionState } from "react";
import type { ActionState } from "@/app/actions";
import {
  addHelpRequestAction,
  addOpportunityAction,
  addResourceAction,
} from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import {
  INDUSTRIES,
  LOCATIONS,
  OPPORTUNITY_TYPES,
  RESOURCE_CATEGORIES,
} from "@/lib/taxonomy";

const EMPTY: ActionState = {};

function FormShell({
  children,
  state,
  submitLabel,
}: {
  children: React.ReactNode;
  state: ActionState;
  submitLabel: string;
}) {
  return (
    <div className="card space-y-3 p-4">
      {children}
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-700">Posted. Thanks for sharing.</p>}
      <SubmitButton pendingLabel="Posting...">{submitLabel}</SubmitButton>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}

export function AddResourceForm() {
  const [state, action] = useActionState(addResourceAction, EMPTY);
  return (
    <form action={action}>
      <FormShell state={state} submitLabel="Share resource">
        <Field label="Title">
          <input name="title" required className="input" placeholder="Investment Banking Interview Guide" />
        </Field>
        <Field label="Description">
          <textarea
            name="description"
            rows={3}
            className="input"
            placeholder="What is it, and who should read it?"
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Category">
            <select name="category" className="input">
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Field>
          <Field label="Tags (comma separated)">
            <input name="tags" className="input" placeholder="IB, interviews, modelling" />
          </Field>
        </div>
        <Field label="Link">
          <input name="url" required className="input" placeholder="https://..." />
        </Field>
      </FormShell>
    </form>
  );
}

export function AddOpportunityForm() {
  const [state, action] = useActionState(addOpportunityAction, EMPTY);
  return (
    <form action={action}>
      <FormShell state={state} submitLabel="Post opportunity">
        <Field label="Title">
          <input name="title" required className="input" placeholder="Product Manager — Fintech Startup" />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Company">
            <input name="company" className="input" placeholder="Setu" />
          </Field>
          <Field label="Type">
            <select name="type" className="input">
              {OPPORTUNITY_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <Field label="Industry">
            <select name="industry" className="input">
              <option value="">—</option>
              {INDUSTRIES.map((i) => (
                <option key={i}>{i}</option>
              ))}
            </select>
          </Field>
          <Field label="Role">
            <input name="role" className="input" placeholder="Product" />
          </Field>
          <Field label="Location">
            <select name="location" className="input">
              <option value="">—</option>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </Field>
          <Field label="Deadline">
            <input type="date" name="deadline" className="input" />
          </Field>
        </div>
        <Field label="Description">
          <textarea name="description" rows={3} className="input" placeholder="What is the role, and how can the cohort apply?" />
        </Field>
        <Field label="Application or contact link">
          <input name="url" className="input" placeholder="https://... or mailto:you@cohort.edu" />
        </Field>
      </FormShell>
    </form>
  );
}

export function AddHelpRequestForm() {
  const [state, action] = useActionState(addHelpRequestAction, EMPTY);
  return (
    <form action={action}>
      <FormShell state={state} submitLabel="Ask the cohort">
        <Field label="What do you need?">
          <input
            name="title"
            required
            className="input"
            placeholder="Looking for someone who has worked in M&A"
          />
        </Field>
        <Field label="Detail">
          <textarea
            name="description"
            rows={3}
            className="input"
            placeholder="Context, how much time it would take, and your deadline."
          />
        </Field>
        <Field label="Tags (comma separated)">
          <input name="tags" className="input" placeholder="M&A, interviews, finance" />
        </Field>
      </FormShell>
    </form>
  );
}
