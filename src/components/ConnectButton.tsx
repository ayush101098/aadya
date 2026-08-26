"use client";

import { useState } from "react";
import { contactHref } from "@/lib/format";

export function ConnectButton({
  name,
  preference,
  handle,
  linkedinUrl,
}: {
  name: string;
  preference: string;
  handle: string;
  linkedinUrl: string | null;
}) {
  const [revealed, setRevealed] = useState(false);
  const href = contactHref(preference, handle);

  if (!revealed) {
    return (
      <button type="button" onClick={() => setRevealed(true)} className="btn-primary">
        Connect
      </button>
    );
  }

  return (
    <div className="rounded-md border border-accent-200 bg-accent-50 p-3 text-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-accent-700">
        Preferred contact — {preference}
      </p>
      <p className="mt-1 break-all text-ink-900">
        {href ? (
          <a href={href} target="_blank" rel="noreferrer" className="font-medium hover:underline">
            {handle}
          </a>
        ) : (
          handle
        )}
      </p>
      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-1 block text-xs text-accent-700 hover:underline"
        >
          LinkedIn profile
        </a>
      )}
      <p className="mt-2 text-xs text-ink-500">
        Say why you're reaching out — {name.split(" ")[0]} will reply faster.
      </p>
    </div>
  );
}
