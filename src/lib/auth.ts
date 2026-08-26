import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Person } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SESSION_COOKIE, accessMode, readSessionValue } from "@/lib/session";
import { loadPeople } from "@/lib/data";

/**
 * The signed-in cohort member, or null.
 *
 * Without Supabase the identity comes from the signed access-gate cookie; with Supabase
 * it comes from the auth session. Either way the person must be on the roster.
 */
export const getCurrentUser = cache(async (): Promise<Person | null> => {
  const people = await loadPeople();

  if (!isSupabaseConfigured) {
    const cookieStore = await cookies();
    const email = await readSessionValue(cookieStore.get(SESSION_COOKIE)?.value);
    if (!email) return null;
    return people.find((p) => p.email.toLowerCase() === email) ?? null;
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return (
    people.find((p) => p.id === user.id) ??
    people.find((p) => p.email.toLowerCase() === (user.email ?? "").toLowerCase()) ??
    null
  );
});

/** Use in any page that requires an approved cohort member. */
export async function requireUser(): Promise<Person> {
  const user = await getCurrentUser();
  if (!user) redirect(isSupabaseConfigured ? "/pending" : "/login");
  // Re-checked on every request, so tightening ACCESS_MODE locks out sessions
  // that were issued while the site was open.
  if (!isSupabaseConfigured && accessMode() === "admin" && user.role !== "admin") {
    redirect("/login?denied=1");
  }
  return user;
}

export async function requireAdmin(): Promise<Person> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
