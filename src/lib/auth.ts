import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Person } from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { loadPeople } from "@/lib/data";

export const DEMO_USER_COOKIE = "cf_demo_user";

/**
 * The signed-in cohort member, or null.
 * In demo mode this is whichever seed member the demo switcher has selected.
 */
export const getCurrentUser = cache(async (): Promise<Person | null> => {
  const people = await loadPeople();

  if (!isSupabaseConfigured) {
    const cookieStore = await cookies();
    const selected = cookieStore.get(DEMO_USER_COOKIE)?.value;
    return people.find((p) => p.id === selected) ?? people[0] ?? null;
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
  return user;
}

export async function requireAdmin(): Promise<Person> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/");
  return user;
}
