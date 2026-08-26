"use client";

import { useActionState, useRef } from "react";
import { parseResumeAction, type ResumeState } from "@/app/actions";
import { SubmitButton } from "./SubmitButton";
import { ACCEPTED_RESUME_TYPES, type ResumeDraft } from "@/lib/resume/types";

export function ResumeUpload({ onDraft }: { onDraft: (draft: ResumeDraft, source: string) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useActionState<ResumeState, FormData>(async (prev, formData) => {
    const result = await parseResumeAction(prev, formData);
    if (result.draft) onDraft(result.draft, result.source ?? "keywords");
    return result;
  }, {});

  return (
    <section className="relative overflow-hidden rounded-xl border border-accent-200 bg-gradient-to-br from-accent-50 via-white to-amber-50 p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent-200/30 blur-2xl"
      />
      <div className="relative">
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-base shadow-soft">
            📄
          </span>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-ink-950">Fill this in from your résumé</h2>
            <p className="mt-0.5 text-xs text-ink-600">
              Upload a PDF or Word file and we&apos;ll pre-fill your role, experience, skills and
              interests. Nothing saves until you review it and hit Save.
            </p>
          </div>
        </div>

        <form ref={formRef} action={action} className="mt-3 flex flex-wrap items-center gap-2">
          <input
            type="file"
            name="resume"
            accept={ACCEPTED_RESUME_TYPES}
            required
            className="max-w-full text-xs text-ink-600 file:mr-3 file:rounded-md file:border-0 file:bg-ink-950 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-ink-800"
          />
          <SubmitButton className="btn-amber py-1.5 text-xs" pendingLabel="Reading résumé...">
            Fill from résumé
          </SubmitButton>
        </form>

        {state.error && <p className="mt-2 text-sm text-red-600">{state.error}</p>}

        {state.draft && !state.error && (
          <p className="mt-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs text-emerald-800">
            Filled from <span className="font-medium">{state.fileName}</span>
            {state.source === "keywords" && " using keyword matching (no AI key configured)"}. Check
            every field before saving — résumé parsing gets things wrong.
          </p>
        )}
      </div>
    </section>
  );
}
