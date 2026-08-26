"use client";

import { useActionState, useState } from "react";
import { updateProfileAction, type ActionState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import { CheckboxGroup } from "./CheckboxGroup";
import {
  COHORT_GROUPS,
  CONTACT_PREFERENCES,
  FUNCTIONS,
  INDUSTRIES,
  INTERESTS,
  LOCATIONS,
  LOOKING_FOR,
  SKILLS,
} from "@/lib/taxonomy";
import type { ExperienceItem, Person } from "@/lib/types";

type Row = Pick<ExperienceItem, "company" | "industry" | "function" | "years">;

const BLANK_ROW: Row = { company: "", industry: "", function: "", years: 1 };

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="card p-4">
      <h2 className="text-sm font-semibold text-ink-950">{title}</h2>
      {hint && <p className="mt-0.5 text-xs text-ink-500">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function ProfileEditor({ person }: { person: Person }) {
  const [state, action] = useActionState<ActionState, FormData>(updateProfileAction, {});
  const [rows, setRows] = useState<Row[]>(
    person.experience.length
      ? person.experience.map(({ company, industry, function: fn, years }) => ({
          company,
          industry,
          function: fn,
          years,
        }))
      : [BLANK_ROW],
  );

  return (
    <form action={action} className="space-y-4">
      <Card title="Basics">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="label">Name</span>
            <input name="name" defaultValue={person.name} required className="input" />
          </label>
          <label className="block space-y-1">
            <span className="label">Email</span>
            <input value={person.email} disabled className="input bg-ink-50 text-ink-500" />
          </label>
          <label className="block space-y-1">
            <span className="label">Current role / background</span>
            <input
              name="currentRole"
              defaultValue={person.currentRole}
              className="input"
              placeholder="MBA Candidate • ex-Product Manager"
            />
          </label>
          <label className="block space-y-1">
            <span className="label">Background group</span>
            <select name="group" defaultValue={person.group} className="input">
              <option value="">—</option>
              {COHORT_GROUPS.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="label">Location</span>
            <select name="location" defaultValue={person.location} className="input">
              <option value="">—</option>
              {LOCATIONS.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1">
            <span className="label">LinkedIn URL</span>
            <input name="linkedinUrl" defaultValue={person.linkedinUrl ?? ""} className="input" />
          </label>
          <label className="block space-y-1">
            <span className="label">Preferred contact</span>
            <select
              name="contactPreference"
              defaultValue={person.contactPreference}
              className="input"
            >
              {CONTACT_PREFERENCES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="label">Contact details shown when someone clicks Connect</span>
            <input
              name="contactHandle"
              defaultValue={person.contactHandle}
              className="input"
              placeholder="you@cohort.edu or +91 ..."
            />
          </label>
          <label className="block space-y-1 sm:col-span-2">
            <span className="label">Short bio</span>
            <textarea name="bio" rows={3} defaultValue={person.bio} className="input" />
          </label>
        </div>
      </Card>

      <Card title="Experience" hint="Your industries and functions come from these rows.">
        <div className="space-y-3">
          {rows.map((row, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1.4fr_1fr_1fr_auto_auto]">
              <input
                name="expCompany"
                defaultValue={row.company}
                placeholder="Company"
                className="input"
              />
              <select name="expIndustry" defaultValue={row.industry} className="input">
                <option value="">Industry</option>
                {INDUSTRIES.map((i) => (
                  <option key={i}>{i}</option>
                ))}
              </select>
              <select name="expFunction" defaultValue={row.function} className="input">
                <option value="">Function</option>
                {FUNCTIONS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
              <input
                name="expYears"
                type="number"
                min={0}
                max={40}
                step={1}
                defaultValue={row.years}
                aria-label="Years"
                className="input sm:w-20"
              />
              <button
                type="button"
                onClick={() => setRows((r) => r.filter((_, i) => i !== index))}
                className="btn-ghost px-2"
                aria-label="Remove row"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRows((r) => [...r, { ...BLANK_ROW }])}
            className="btn-secondary"
          >
            + Add experience
          </button>
        </div>
      </Card>

      <Card title="What I can help with" hint="This is what other students search for most.">
        <CheckboxGroup name="skills" options={SKILLS} selected={person.skills} />
      </Card>

      <Card title="Interests">
        <CheckboxGroup name="interests" options={INTERESTS} selected={person.interests} />
      </Card>

      <Card title="What I'm looking for">
        <CheckboxGroup name="lookingFor" options={LOOKING_FOR} selected={person.lookingFor} />
      </Card>

      <div className="sticky bottom-16 flex items-center gap-3 rounded-lg border border-ink-200 bg-white p-3 sm:bottom-4">
        <SubmitButton>Save profile</SubmitButton>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        {state.ok && <p className="text-sm text-emerald-700">Profile saved.</p>}
      </div>
    </form>
  );
}
