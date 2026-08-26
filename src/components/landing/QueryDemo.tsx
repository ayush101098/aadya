"use client";

import { useEffect, useMemo, useState } from "react";

type Demo = {
  query: string;
  answers: { kind: string; label: string; detail: string }[];
};

const DEMOS: Demo[] = [
  {
    query: "Who knows about M&A?",
    answers: [
      { kind: "People", label: "Kabir Shah", detail: "ChrysCapital · 2 healthcare deals" },
      { kind: "People", label: "Ananya Rao", detail: "Kotak IB · sell-side processes" },
      { kind: "Resource", label: "PE Deal Diligence Checklist", detail: "Finance · 4 min read" },
    ],
  },
  {
    query: "Who has worked in FMCG?",
    answers: [
      { kind: "People", label: "Meera Iyer", detail: "P&G · two national launches" },
      { kind: "People", label: "Sneha Kulkarni", detail: "Bain · FMCG & retail clients" },
      { kind: "Opportunity", label: "Unilever Ideatrophy", detail: "Competition · closes 2 Sep" },
    ],
  },
  {
    query: "Who can help me with Python?",
    answers: [
      { kind: "People", label: "Arjun Sethi", detail: "Microsoft · ML systems" },
      { kind: "Resource", label: "Python for Business Analytics", detail: "6 starter notebooks" },
      { kind: "Ask", label: "Anyone good at Python?", detail: "Open · posted 1d ago" },
    ],
  },
  {
    query: "Private Equity",
    answers: [
      { kind: "People", label: "3 students", detail: "PE experience or interest" },
      { kind: "Resource", label: "5 resources", detail: "LBO, diligence, interview prep" },
      { kind: "Opportunity", label: "2 roles", detail: "Summer internship + referral" },
    ],
  },
];

const KIND_STYLE: Record<string, string> = {
  People: "bg-amber-400/15 text-amber-200 border-amber-300/25",
  Resource: "bg-accent-400/15 text-accent-200 border-accent-300/25",
  Opportunity: "bg-emerald-400/15 text-emerald-200 border-emerald-300/25",
  Ask: "bg-white/10 text-ink-200 border-white/15",
};

export function QueryDemo() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<"typing" | "holding">("typing");
  const demo = useMemo(() => DEMOS[index], [index]);

  useEffect(() => {
    if (phase === "typing") {
      if (typed.length < demo.query.length) {
        const timer = setTimeout(() => setTyped(demo.query.slice(0, typed.length + 1)), 45);
        return () => clearTimeout(timer);
      }
      const timer = setTimeout(() => setPhase("holding"), 2600);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => {
      setTyped("");
      setPhase("typing");
      setIndex((i) => (i + 1) % DEMOS.length);
    }, 400);
    return () => clearTimeout(timer);
  }, [typed, phase, demo.query]);

  const answered = typed.length === demo.query.length;

  return (
    <div className="glass overflow-hidden p-1.5 shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)]">
      <div className="flex items-center gap-1.5 px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="ml-2 text-[11px] tracking-wide text-ink-400">
          beerandchill.app / search
        </span>
      </div>

      <div className="rounded-xl border border-white/10 bg-ink-950/70 p-4 sm:p-5">
        <div className="flex items-center gap-2.5 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2.5">
          <svg
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-amber-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 4 4" strokeLinecap="round" />
          </svg>
          <span className="text-sm text-ink-100">
            {typed}
            <span className="ml-0.5 inline-block h-4 w-[2px] translate-y-0.5 bg-amber-300 animate-caret" />
          </span>
        </div>

        <ul className="mt-3 space-y-2">
          {demo.answers.map((answer, i) => (
            <li
              key={`${demo.query}-${answer.label}`}
              style={{ transitionDelay: `${i * 110}ms` }}
              className={`flex items-center gap-3 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 transition-all duration-500 ${
                answered ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
              }`}
            >
              <span
                className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  KIND_STYLE[answer.kind] ?? KIND_STYLE.Ask
                }`}
              >
                {answer.kind}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-medium text-ink-50">
                  {answer.label}
                </span>
                <span className="block truncate text-xs text-ink-400">{answer.detail}</span>
              </span>
            </li>
          ))}
        </ul>

        <p
          className={`mt-3 text-[11px] tracking-wide text-ink-500 transition-opacity duration-700 ${
            answered ? "opacity-100" : "opacity-0"
          }`}
        >
          Answered in one search — no WhatsApp archaeology.
        </p>
      </div>
    </div>
  );
}
