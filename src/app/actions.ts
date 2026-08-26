"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser, requireUser } from "@/lib/auth";
import { SESSION_COOKIE, accessCode, accessMode, createSessionValue } from "@/lib/session";
import { loadPeople } from "@/lib/data";
import { parseTags } from "@/lib/format";
import { extractResumeText, tidyResumeText } from "@/lib/resume/extract";
import { parseResume } from "@/lib/resume/parse";
import { MAX_RESUME_BYTES, type ResumeDraft } from "@/lib/resume/types";
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

export type ResumeState = {
  error?: string;
  draft?: ResumeDraft;
  source?: "claude" | "keywords";
  fileName?: string;
};

/**
 * Reads an uploaded résumé and returns a draft profile for the member to review.
 * Nothing is saved here — the draft only pre-fills the form.
 */
export async function parseResumeAction(
  _prev: ResumeState,
  formData: FormData,
): Promise<ResumeState> {
  await requireUser();

  const file = formData.get("resume");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a résumé file first." };
  }
  if (file.size > MAX_RESUME_BYTES) {
    return { error: "That file is over 5 MB. Upload a smaller PDF or Word file." };
  }

  try {
    const text = tidyResumeText(await extractResumeText(file));
    if (text.length < 120) {
      return {
        error:
          "Couldn't read enough text from that file — if it's a scanned PDF, try the Word version.",
      };
    }

    const { draft, source } = await parseResume(text);
    return { draft, source, fileName: file.name };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Couldn't read that file.",
    };
  }
}

/**
 * Access gate used until Supabase auth is switched on: the email must be on the cohort
 * roster and the person must know the shared access code. While ACCESS_MODE is "admin"
 * only admins get through, so the site stays private while it is being set up.
 */
export async function signInAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const email = str(formData, "email").toLowerCase();
  const code = str(formData, "code");

  if (!email.endsWith("@isb.edu")) {
    return { error: "Use your ISB address — that's what the cohort list is keyed on." };
  }

  const people = await loadPeople();
  const member = people.find((p) => p.email.toLowerCase() === email);
  if (!member) {
    return { error: "That address isn't on the cohort list. Ask an admin to add you." };
  }
  if (code !== accessCode()) {
    return { error: "That access code isn't right." };
  }
  if (accessMode() === "admin" && member.role !== "admin") {
    return {
      error:
        "The site is still in setup — only admins can sign in right now. You'll get access when it opens to the batch.",
    };
  }

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, await createSessionValue(email), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  redirect(str(formData, "next") || "/home");
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
    group: str(formData, "group"),
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
    group: str(formData, "group"),
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
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);

  const { isSupabaseConfigured } = await import("@/lib/supabase/config");
  if (isSupabaseConfigured) {
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
