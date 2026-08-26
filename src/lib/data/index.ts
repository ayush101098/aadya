import { cache } from "react";
import type {
  HelpRequest,
  Opportunity,
  Person,
  Resource,
  SearchResults,
} from "@/lib/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { demoStore, newId } from "./demo-store";
import {
  PERSON_SELECT,
  mapHelpRequest,
  mapOpportunity,
  mapPerson,
  mapResource,
} from "./mappers";
import {
  byNewest,
  filterHelpRequests,
  filterOpportunities,
  filterPeople,
  filterResources,
} from "./filters";

/* ------------------------------------------------------------------ reads */

export const loadPeople = cache(async (): Promise<Person[]> => {
  if (!isSupabaseConfigured) return [...demoStore().people];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("users").select(PERSON_SELECT);
  if (error) throw new Error(`Failed to load people: ${error.message}`);
  return (data ?? []).map(mapPerson);
});

export const loadResources = cache(async (): Promise<Resource[]> => {
  if (!isSupabaseConfigured) return [...demoStore().resources];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("resources").select("*");
  if (error) throw new Error(`Failed to load resources: ${error.message}`);
  return (data ?? []).map(mapResource);
});

export const loadOpportunities = cache(async (): Promise<Opportunity[]> => {
  if (!isSupabaseConfigured) return [...demoStore().opportunities];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("opportunities").select("*");
  if (error) throw new Error(`Failed to load opportunities: ${error.message}`);
  return (data ?? []).map(mapOpportunity);
});

export const loadHelpRequests = cache(async (): Promise<HelpRequest[]> => {
  if (!isSupabaseConfigured) return [...demoStore().helpRequests];
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("help_requests").select("*");
  if (error) throw new Error(`Failed to load help requests: ${error.message}`);
  return (data ?? []).map(mapHelpRequest);
});

export async function getPerson(id: string): Promise<Person | null> {
  const people = await loadPeople();
  return people.find((p) => p.id === id) ?? null;
}

export async function getPeopleById(): Promise<Map<string, Person>> {
  const people = await loadPeople();
  return new Map(people.map((p) => [p.id, p]));
}

export async function searchEverything(query: string): Promise<SearchResults> {
  const q = query.trim();
  const [people, resources, opportunities, helpRequests] = await Promise.all([
    loadPeople(),
    loadResources(),
    loadOpportunities(),
    loadHelpRequests(),
  ]);

  return {
    query: q,
    people: filterPeople(people, { q }).sort((a, b) => a.name.localeCompare(b.name)),
    resources: filterResources(resources, { q }).sort(byNewest),
    opportunities: filterOpportunities(opportunities, { q }).sort(byNewest),
    helpRequests: filterHelpRequests(helpRequests, { q }).sort(byNewest),
  };
}

/* ----------------------------------------------------------------- writes */

export type ResourceInput = Omit<Resource, "id" | "createdAt">;
export type OpportunityInput = Omit<Opportunity, "id" | "createdAt" | "status">;
export type HelpRequestInput = Omit<HelpRequest, "id" | "createdAt" | "status">;

export async function createResource(input: ResourceInput): Promise<void> {
  if (!isSupabaseConfigured) {
    demoStore().resources.unshift({
      ...input,
      id: newId("r"),
      createdAt: new Date().toISOString(),
    });
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("resources").insert({
    title: input.title,
    description: input.description,
    category: input.category,
    url: input.url,
    tags: input.tags,
    uploaded_by: input.uploadedBy,
  });
  if (error) throw new Error(error.message);
}

export async function createOpportunity(input: OpportunityInput): Promise<void> {
  if (!isSupabaseConfigured) {
    demoStore().opportunities.unshift({
      ...input,
      id: newId("o"),
      status: "open",
      createdAt: new Date().toISOString(),
    });
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("opportunities").insert({
    title: input.title,
    company: input.company,
    type: input.type,
    industry: input.industry,
    role: input.role,
    location: input.location,
    deadline: input.deadline,
    description: input.description,
    url: input.url,
    posted_by: input.postedBy,
    status: "open",
  });
  if (error) throw new Error(error.message);
}

export async function createHelpRequest(input: HelpRequestInput): Promise<void> {
  if (!isSupabaseConfigured) {
    demoStore().helpRequests.unshift({
      ...input,
      id: newId("h"),
      status: "open",
      createdAt: new Date().toISOString(),
    });
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("help_requests").insert({
    title: input.title,
    description: input.description,
    tags: input.tags,
    posted_by: input.postedBy,
    status: "open",
  });
  if (error) throw new Error(error.message);
}

export async function setHelpRequestStatus(
  id: string,
  status: HelpRequest["status"],
): Promise<void> {
  if (!isSupabaseConfigured) {
    const item = demoStore().helpRequests.find((h) => h.id === id);
    if (item) item.status = status;
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("help_requests").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setOpportunityStatus(
  id: string,
  status: Opportunity["status"],
): Promise<void> {
  if (!isSupabaseConfigured) {
    const item = demoStore().opportunities.find((o) => o.id === id);
    if (item) item.status = status;
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("opportunities").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export type ProfilePatch = {
  name: string;
  bio: string;
  currentRole: string;
  location: string;
  linkedinUrl: string | null;
  contactPreference: string;
  contactHandle: string;
  skills: string[];
  interests: string[];
  lookingFor: string[];
  experience: { company: string; industry: string; function: string; years: number }[];
};

export async function updateProfile(id: string, patch: ProfilePatch): Promise<void> {
  if (!isSupabaseConfigured) {
    const person = demoStore().people.find((p) => p.id === id);
    if (!person) throw new Error("Profile not found");
    Object.assign(person, {
      name: patch.name,
      bio: patch.bio,
      currentRole: patch.currentRole,
      location: patch.location,
      linkedinUrl: patch.linkedinUrl,
      contactPreference: patch.contactPreference,
      contactHandle: patch.contactHandle,
      skills: patch.skills,
      interests: patch.interests,
      lookingFor: patch.lookingFor,
      experience: patch.experience.map((e, i) => ({ ...e, id: `${id}_e${i}` })),
    });
    return;
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("users")
    .update({
      name: patch.name,
      bio: patch.bio,
      current_role: patch.currentRole,
      location: patch.location,
      linkedin_url: patch.linkedinUrl,
      contact_preference: patch.contactPreference,
      contact_handle: patch.contactHandle,
    })
    .eq("id", id);
  if (error) throw new Error(error.message);

  // Tag tables are small; replace them wholesale rather than diffing.
  await replaceChildRows(id, "skills", "skill", patch.skills);
  await replaceChildRows(id, "interests", "interest", patch.interests);
  await replaceChildRows(id, "looking_for", "category", patch.lookingFor);

  await supabase.from("experience").delete().eq("user_id", id);
  if (patch.experience.length) {
    const { error: expError } = await supabase.from("experience").insert(
      patch.experience.map((e) => ({
        user_id: id,
        company: e.company,
        industry: e.industry,
        function: e.function,
        years: e.years,
      })),
    );
    if (expError) throw new Error(expError.message);
  }
}

async function replaceChildRows(
  userId: string,
  table: string,
  column: string,
  values: string[],
) {
  const supabase = await createSupabaseServerClient();
  await supabase.from(table).delete().eq("user_id", userId);
  if (!values.length) return;
  const { error } = await supabase
    .from(table)
    .insert(values.map((value) => ({ user_id: userId, [column]: value })));
  if (error) throw new Error(error.message);
}

/* ------------------------------------------------------------------ admin */

export async function deleteRecord(
  table: "resources" | "opportunities" | "help_requests",
  id: string,
): Promise<void> {
  if (!isSupabaseConfigured) {
    const store = demoStore();
    const list =
      table === "resources"
        ? store.resources
        : table === "opportunities"
          ? store.opportunities
          : store.helpRequests;
    const index = list.findIndex((item) => item.id === id);
    if (index >= 0) list.splice(index, 1);
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function addMember(input: {
  name: string;
  email: string;
  currentRole: string;
  location: string;
  role: "admin" | "student";
}): Promise<void> {
  if (!isSupabaseConfigured) {
    demoStore().people.push({
      id: newId("p"),
      name: input.name,
      email: input.email,
      photo: null,
      bio: "",
      currentRole: input.currentRole,
      location: input.location,
      linkedinUrl: null,
      contactPreference: "Email",
      contactHandle: input.email,
      role: input.role,
      experience: [],
      skills: [],
      interests: [],
      lookingFor: [],
      createdAt: new Date().toISOString(),
    });
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").insert({
    name: input.name,
    email: input.email,
    current_role: input.currentRole,
    location: input.location,
    contact_preference: "Email",
    contact_handle: input.email,
    role: input.role,
  });
  if (error) throw new Error(error.message);
}

export async function removeMember(id: string): Promise<void> {
  if (!isSupabaseConfigured) {
    const people = demoStore().people;
    const index = people.findIndex((p) => p.id === id);
    if (index >= 0) people.splice(index, 1);
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setMemberRole(id: string, role: "admin" | "student"): Promise<void> {
  if (!isSupabaseConfigured) {
    const person = demoStore().people.find((p) => p.id === id);
    if (person) person.role = role;
    return;
  }
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("users").update({ role }).eq("id", id);
  if (error) throw new Error(error.message);
}
