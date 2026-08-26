export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950 text-ink-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_0%,rgba(255,180,32,.18),transparent_70%),radial-gradient(45%_40%_at_15%_80%,rgba(79,99,245,.22),transparent_70%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 grid-lines opacity-40" />
      <div className="relative flex min-h-screen items-center justify-center px-4 py-16">
        {children}
      </div>
    </div>
  );
}
