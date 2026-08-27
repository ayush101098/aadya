import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { loadPeople, searchEverything } from "@/lib/data";
import { SearchBar } from "@/components/SearchBar";
import {
  HelpRequestCard,
  OpportunityCard,
  PersonCard,
  ResourceCard,
} from "@/components/cards";
import { EmptyState } from "@/components/EmptyState";
import { one, type SearchParams } from "@/lib/params";

const SUGGESTIONS = ["Private Equity", "FMCG", "Python", "M&A", "Product", "AI"];

function ResultSection({
  title,
  count,
  href,
  children,
}: {
  title: string;
  count: number;
  href: string;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between">
        <h2 className="section-title">
          {title} <span className="text-ink-400">({count})</span>
        </h2>
        <Link href={href} className="text-xs font-medium text-accent-700">
          Refine →
        </Link>
      </div>
      {children}
    </section>
  );
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  await getCurrentUser();
  const params = await searchParams;
  const query = one(params, "q") ?? "";

  const [results, people] = await Promise.all([searchEverything(query), loadPeople()]);
  const byId = new Map(people.map((p) => [p.id, p]));
  const encoded = encodeURIComponent(query);
  const total =
    results.people.length +
    results.resources.length +
    results.opportunities.length +
    results.helpRequests.length;

  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <h1 className="text-lg font-semibold tracking-tight text-ink-950">
          {query ? `Results for "${query}"` : "Search the cohort"}
        </h1>
        <SearchBar defaultValue={query} size="lg" autoFocus={!query} />
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-500">
          <span>Try:</span>
          {SUGGESTIONS.map((suggestion) => (
            <Link
              key={suggestion}
              href={`/search?q=${encodeURIComponent(suggestion)}`}
              className="tag hover:bg-ink-200"
            >
              {suggestion}
            </Link>
          ))}
        </div>
        {query && (
          <p className="text-sm text-ink-600">
            {total} result{total === 1 ? "" : "s"} across people, resources, opportunities and
            requests.
          </p>
        )}
      </header>

      {query && total === 0 && (
        <EmptyState
          title="Nothing found."
          hint="Try a broader term — an industry, a company, or a skill."
        />
      )}

      <ResultSection
        title="People"
        count={results.people.length}
        href={`/people?q=${encoded}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {results.people.slice(0, 6).map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Resources"
        count={results.resources.length}
        href={`/resources?q=${encoded}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {results.resources.slice(0, 4).map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              uploader={byId.get(resource.uploadedBy)}
            />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Opportunities"
        count={results.opportunities.length}
        href={`/opportunities?q=${encoded}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {results.opportunities.slice(0, 4).map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              poster={byId.get(opportunity.postedBy)}
            />
          ))}
        </div>
      </ResultSection>

      <ResultSection
        title="Ask the Cohort"
        count={results.helpRequests.length}
        href={`/ask?q=${encoded}`}
      >
        <div className="grid gap-3 md:grid-cols-2">
          {results.helpRequests.slice(0, 4).map((request) => (
            <HelpRequestCard
              key={request.id}
              request={request}
              poster={byId.get(request.postedBy)}
            />
          ))}
        </div>
      </ResultSection>
    </div>
  );
}
