import type { HelpRequest, Opportunity, Person, Resource } from "@/lib/types";

type Row = Record<string, any>;

export function mapPerson(row: Row): Person {
  return {
    id: row.id,
    name: row.name ?? "",
    email: row.email ?? "",
    photo: row.photo ?? null,
    bio: row.bio ?? "",
    currentRole: row.current_role ?? "",
    location: row.location ?? "",
    linkedinUrl: row.linkedin_url ?? null,
    contactPreference: row.contact_preference ?? "Email",
    contactHandle: row.contact_handle || row.email || "",
    role: row.role === "admin" ? "admin" : "student",
    experience: (row.experience ?? []).map((e: Row) => ({
      id: e.id,
      company: e.company ?? "",
      industry: e.industry ?? "",
      function: e.function ?? "",
      years: Number(e.years ?? 0),
    })),
    skills: (row.skills ?? []).map((s: Row) => s.skill).filter(Boolean),
    interests: (row.interests ?? []).map((i: Row) => i.interest).filter(Boolean),
    lookingFor: (row.looking_for ?? []).map((l: Row) => l.category).filter(Boolean),
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function mapResource(row: Row): Resource {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    category: row.category ?? "Other",
    url: row.url ?? "",
    tags: row.tags ?? [],
    uploadedBy: row.uploaded_by ?? "",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function mapOpportunity(row: Row): Opportunity {
  return {
    id: row.id,
    title: row.title ?? "",
    company: row.company ?? "",
    type: row.type ?? "Other",
    industry: row.industry ?? "",
    role: row.role ?? "",
    location: row.location ?? "",
    deadline: row.deadline ?? null,
    description: row.description ?? "",
    url: row.url ?? "",
    postedBy: row.posted_by ?? "",
    status: row.status === "closed" ? "closed" : "open",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export function mapHelpRequest(row: Row): HelpRequest {
  return {
    id: row.id,
    title: row.title ?? "",
    description: row.description ?? "",
    tags: row.tags ?? [],
    postedBy: row.posted_by ?? "",
    status: row.status === "resolved" ? "resolved" : "open",
    createdAt: row.created_at ?? new Date().toISOString(),
  };
}

export const PERSON_SELECT =
  "*, experience(*), skills(skill), interests(interest), looking_for(category)";
