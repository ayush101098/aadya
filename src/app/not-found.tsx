import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <h1 className="text-lg font-semibold text-ink-950">Not found</h1>
      <p className="mt-2 text-sm text-ink-600">
        That page or profile doesn't exist — it may have been removed by an admin.
      </p>
      <Link href="/home" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  );
}
