"use client";

import { useState } from "react";

export function Collapsible({
  label,
  children,
  openLabel,
  defaultOpen = false,
}: {
  label: string;
  openLabel?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={open ? "btn-secondary" : "btn-primary"}
      >
        {open ? (openLabel ?? "Cancel") : label}
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}
