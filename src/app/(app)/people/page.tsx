import { requireUser } from "@/lib/auth";
import { loadPeople } from "@/lib/data";
import { filterPeople } from "@/lib/data/filters";
import { FilterBar } from "@/components/FilterBar";
import { PersonCard } from "@/components/cards";
import { EmptyState } from "@/components/EmptyState";
import {
  COHORT_GROUPS,
  FUNCTIONS,
  INDUSTRIES,
  INTERESTS,
  LOCATIONS,
  LOOKING_FOR,
  SKILLS,
} from "@/lib/taxonomy";
import { one, type SearchParams } from "@/lib/params";

export default async function PeoplePage({ searchParams }: { searchParams: SearchParams }) {
  await requireUser();
  const params = await searchParams;
  const people = await loadPeople();

  const results = filterPeople(people, {
    q: one(params, "q"),
    group: one(params, "group"),
    industry: one(params, "industry"),
    function: one(params, "function"),
    skill: one(params, "skill"),
    interest: one(params, "interest"),
    location: one(params, "location"),
    lookingFor: one(params, "lookingFor"),
  }).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="space-y-4">
      <header>
        <h1 className="text-lg font-semibold tracking-tight text-ink-950">People</h1>
        <p className="text-sm text-ink-600">
          {people.length} cohort members. Filter by what they have done, know, or want.
        </p>
      </header>

      <FilterBar
        placeholder="Name, company, skill, interest..."
        resultCount={results.length}
        filters={[
          { name: "group", label: "Background", options: COHORT_GROUPS },
          { name: "industry", label: "Industry", options: INDUSTRIES },
          { name: "function", label: "Function", options: FUNCTIONS },
          { name: "skill", label: "Can help with", options: SKILLS },
          { name: "interest", label: "Interest", options: INTERESTS },
          { name: "location", label: "Location", options: LOCATIONS },
          { name: "lookingFor", label: "Looking for", options: LOOKING_FOR },
        ]}
      />

      {results.length === 0 ? (
        <EmptyState
          title="No one matches those filters yet."
          hint="Try a single filter, or search a company name or skill instead."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  );
}
