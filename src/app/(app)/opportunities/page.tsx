import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { loadOpportunities, loadPeople } from "@/lib/data";
import { byNewest, filterOpportunities } from "@/lib/data/filters";
import { FilterBar } from "@/components/FilterBar";
import { OpportunityCard } from "@/components/cards";
import { EmptyState } from "@/components/EmptyState";
import { Collapsible } from "@/components/Collapsible";
import { AddOpportunityForm } from "@/components/forms";
import { INDUSTRIES, LOCATIONS, OPPORTUNITY_TYPES } from "@/lib/taxonomy";
import { one, type SearchParams } from "@/lib/params";

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const [opportunities, people] = await Promise.all([loadOpportunities(), loadPeople()]);
  const byId = new Map(people.map((p) => [p.id, p]));

  const results = filterOpportunities(opportunities, {
    q: one(params, "q"),
    type: one(params, "type"),
    industry: one(params, "industry"),
    location: one(params, "location"),
  }).sort(byNewest);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink-950">Opportunities</h1>
          <p className="text-sm text-ink-600">
            Jobs, internships, referrals and projects shared within the cohort. Not a replacement
            for official placement services.
          </p>
        </div>
        {user ? (
          <Collapsible label="Post an opportunity" defaultOpen={one(params, "new") === "1"}>
            <AddOpportunityForm />
          </Collapsible>
        ) : (
          <Link href="/login" className="btn-secondary">
            Sign in to post
          </Link>
        )}
      </header>

      <FilterBar
        placeholder="Role, company, industry..."
        resultCount={results.length}
        filters={[
          { name: "type", label: "Type", options: OPPORTUNITY_TYPES },
          { name: "industry", label: "Industry", options: INDUSTRIES },
          { name: "location", label: "Location", options: LOCATIONS },
        ]}
      />

      {results.length === 0 ? (
        <EmptyState
          title="Nothing posted for that yet."
          hint="Clear the filters, or post the referral you can offer."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              poster={byId.get(opportunity.postedBy)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
