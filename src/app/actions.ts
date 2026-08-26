"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DEMO_USER_COOKIE, getCurrentUser, requireUser } from "@/lib/auth";
import { parseTags } from "@/lib/format";
import {
  addMember,
  createHelpRequest,
  createOpportunity,
  createResource,
  deleteRecord,
  removeMember,
  setHelpRequestStatus,
  setMemberRole,
  setOpportunityStatus,
  updateProfile,
} from "@/lib/data";

const str = (data: FormData, key: string) => String(data.get(key) ?? "").trim();
const list = (data: FormData, key: string) =>
  data.getAll(key).map((v) => String(v).trim()).filter(Boolean);

export type ActionState = { error?: string; ok?: boolean };

export async function switchDemoUser(formData: FormData) {
  const id = str(formData, "userId");
  const cookieStore = await cookies();
  cookieStore.set(DEMO_USER_COOKIE, id, { path: "/", maxAge: 60 * 60 * 24 * 30 });
  revalidatePath("/", "layout");
}

export async function addResourceAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const title = str(formData, "title");
  const url = str(formData, "url");
  if (!title) return { error: "Give the resource a title." };
  if (!url) return { error: "Add a link so people can open it." };

  await createResource({
    title,
    description: str(formData, "description"),
    category: str(formData, "category") || "Other",
    url,
    tags: parseTags(str(formData, "tags")),
    uploadedBy: user.id,
  });
  revalidatePath("/resources");
  revalidatePath("/");
  return { ok: true };
}

export async function addOpportunityAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const title = str(formData, "title");
  if (!title) return { error: "Give the opportunity a title." };

  await createOpportunity({
    title,
    company: str(formData, "company"),
    type: str(formData, "type") || "Other",
    industry: str(formData, "industry"),
    role: str(formData, "role"),
    location: str(formData, "location"),
    deadline: str(formData, "deadline") || null,
    description: str(formData, "description"),
    url: str(formData, "url") || `mailto:${user.email}`,
    postedBy: user.id,
  });
  revalidatePath("/opportunities");
  revalidatePath("/");
  return { ok: true };
}

export async function addHelpRequestAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const title = str(formData, "title");
  if (!title) return { error: "What do you need help with?" };

  await createHelpRequest({
    title,
    description: str(formData, "description"),
    tags: parseTags(str(formData, "tags")),
    postedBy: user.id,
  });
  revalidatePath("/ask");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleHelpStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = str(formData, "id");
  const status = str(formData, "status") === "resolved" ? "resolved" : "open";
  if (user.role !== "admin" && str(formData, "postedBy") !== user.id) return;
  await setHelpRequestStatus(id, status);
  revalidatePath("/ask");
}

export async function toggleOpportunityStatusAction(formData: FormData) {
  const user = await requireUser();
  const id = str(formData, "id");
  const status = str(formData, "status") === "closed" ? "closed" : "open";
  if (user.role !== "admin" && str(formData, "postedBy") !== user.id) return;
  await setOpportunityStatus(id, status);
  revalidatePath("/opportunities");
}

export async function updateProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireUser();
  const name = str(formData, "name");
  if (!name) return { error: "Your name can't be empty." };

  const companies = formData.getAll("expCompany").map(String);
  const industries = formData.getAll("expIndustry").map(String);
  const functions = formData.getAll("expFunction").map(String);
  const years = formData.getAll("expYears").map(String);

  const experience = companies
    .map((company, i) => ({
      company: company.trim(),
      industry: (industries[i] ?? "").trim(),
      function: (functions[i] ?? "").trim(),
      years: Number(years[i] ?? 0) || 0,
    }))
    .filter((e) => e.company || e.industry || e.function);

  await updateProfile(user.id, {
    name,
    bio: str(formData, "bio"),
    currentRole: str(formData, "currentRole"),
    location: str(formData, "location"),
    linkedinUrl: str(formData, "linkedinUrl") || null,
    contactPreference: str(formData, "contactPreference") || "Email",
    contactHandle: str(formData, "contactHandle") || user.email,
    skills: list(formData, "skills"),
    interests: list(formData, "interests"),
    lookingFor: list(formData, "lookingFor"),
    experience,
  });

  revalidatePath("/profile");
  revalidatePath("/people");
  revalidatePath(`/people/${user.id}`);
  return { ok: true };
}

/* ------------------------------------------------------------------ admin */

async function assertAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "admin") throw new Error("Admins only");
  return user;
}

export async function adminDeleteAction(formData: FormData) {
  await assertAdmin();
  const table = str(formData, "table") as "resources" | "opportunities" | "help_requests";
  await deleteRecord(table, str(formData, "id"));
  revalidatePath("/admin");
  revalidatePath("/resources");
  revalidatePath("/opportunities");
  revalidatePath("/ask");
}

export async function adminAddMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await assertAdmin();
  const name = str(formData, "name");
  const email = str(formData, "email");
  if (!name || !email) return { error: "Name and email are both required." };

  await addMember({
    name,
    email,
    currentRole: str(formData, "currentRole"),
    location: str(formData, "location"),
    role: str(formData, "role") === "admin" ? "admin" : "student",
  });
  revalidatePath("/admin");
  revalidatePath("/people");
  return { ok: true };
}

export async function adminRemoveMemberAction(formData: FormData) {
  const admin = await assertAdmin();
  const id = str(formData, "id");
  if (id === admin.id) return;
  await removeMember(id);
  revalidatePath("/admin");
  revalidatePath("/people");
}

export async function adminSetRoleAction(formData: FormData) {
  await assertAdmin();
  await setMemberRole(str(formData, "id"), str(formData, "role") === "admin" ? "admin" : "student");
  revalidatePath("/admin");
}

export async function signOutAction() {
  const { isSupabaseConfigured } = await import("@/lib/supabase/config");
  if (isSupabaseConfigured) {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
