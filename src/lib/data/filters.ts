import type {
  HelpFilters,
  HelpRequest,
  Opportunity,
  OpportunityFilters,
  PeopleFilters,
  Person,
  Resource,
  ResourceFilters,
} from "@/lib/types";

const norm = (s: string) => s.toLowerCase().trim();

export function personIndustries(p: Person) {
  return Array.from(new Set(p.experience.map((e) => e.industry))).filter(Boolean);
}

export function personFunctions(p: Person) {
  return Array.from(new Set(p.experience.map((e) => e.function))).filter(Boolean);
}

export function personCompanies(p: Person) {
  return Array.from(new Set(p.experience.map((e) => e.company))).filter(Boolean);
}

function personHaystack(p: Person) {
  return norm(
    [
      p.name,
      p.currentRole,
      p.bio,
      p.location,
      ...personIndustries(p),
      ...personFunctions(p),
      ...personCompanies(p),
      ...p.skills,
      ...p.interests,
      ...p.lookingFor,
    ].join(" · "),
  );
}

function matchesQuery(haystack: string, q?: string) {
  if (!q) return true;
  const terms = norm(q).split(/\s+/).filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

export function filterPeople(people: Person[], f: PeopleFilters) {
  return people.filter((p) => {
    if (f.industry && !personIndustries(p).includes(f.industry)) return false;
    if (f.function && !personFunctions(p).includes(f.function)) return false;
    if (f.skill && !p.skills.includes(f.skill)) return false;
    if (f.interest && !p.interests.includes(f.interest)) return false;
    if (f.location && p.location !== f.location) return false;
    if (f.lookingFor && !p.lookingFor.includes(f.lookingFor)) return false;
    return matchesQuery(personHaystack(p), f.q);
  });
}

export function filterResources(resources: Resource[], f: ResourceFilters) {
  return resources.filter((r) => {
    if (f.category && r.category !== f.category) return false;
    const hay = norm([r.title, r.description, r.category, ...r.tags].join(" · "));
    return matchesQuery(hay, f.q);
  });
}

export function filterOpportunities(opportunities: Opportunity[], f: OpportunityFilters) {
  return opportunities.filter((o) => {
    if (f.type && o.type !== f.type) return false;
    if (f.industry && o.industry !== f.industry) return false;
    if (f.location && o.location !== f.location) return false;
    const hay = norm(
      [o.title, o.company, o.type, o.industry, o.role, o.location, o.description].join(" · "),
    );
    return matchesQuery(hay, f.q);
  });
}

export function filterHelpRequests(requests: HelpRequest[], f: HelpFilters) {
  return requests.filter((h) => {
    if (f.status && h.status !== f.status) return false;
    const hay = norm([h.title, h.description, ...h.tags].join(" · "));
    return matchesQuery(hay, f.q);
  });
}

export const byNewest = <T extends { createdAt: string }>(a: T, b: T) =>
  b.createdAt.localeCompare(a.createdAt);
