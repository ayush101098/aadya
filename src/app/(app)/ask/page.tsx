import { requireUser } from "@/lib/auth";
import { loadHelpRequests, loadPeople } from "@/lib/data";
import { byNewest, filterHelpRequests } from "@/lib/data/filters";
import { FilterBar } from "@/components/FilterBar";
import { HelpRequestCard } from "@/components/cards";
import { EmptyState } from "@/components/EmptyState";
import { Collapsible } from "@/components/Collapsible";
import { AddHelpRequestForm } from "@/components/forms";
import { toggleHelpStatusAction } from "@/app/actions";
import { one, type SearchParams } from "@/lib/params";

export default async function AskPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await requireUser();
  const params = await searchParams;
  const [requests, people] = await Promise.all([loadHelpRequests(), loadPeople()]);
  const byId = new Map(people.map((p) => [p.id, p]));

  const results = filterHelpRequests(requests, {
    q: one(params, "q"),
    status: one(params, "status"),
  }).sort(byNewest);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink-950">Ask the Cohort</h1>
          <p className="text-sm text-ink-600">
            Someone here has done it. Post what you need and let the cohort come to you.
          </p>
        </div>
        <Collapsible label="Ask for help" defaultOpen={one(params, "new") === "1"}>
          <AddHelpRequestForm />
        </Collapsible>
      </header>

      <FilterBar
        placeholder="Topic, skill, company..."
        resultCount={results.length}
        filters={[{ name: "status", label: "Status", options: ["open", "resolved"] }]}
      />

      {results.length === 0 ? (
        <EmptyState
          title="No requests match that."
          hint="Clear the filters, or post your own question."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((request) => {
            const canEdit = user.role === "admin" || request.postedBy === user.id;
            return (
              <HelpRequestCard
                key={request.id}
                request={request}
                poster={byId.get(request.postedBy)}
                actions={
                  canEdit ? (
                    <form action={toggleHelpStatusAction}>
                      <input type="hidden" name="id" value={request.id} />
                      <input type="hidden" name="postedBy" value={request.postedBy} />
                      <input
                        type="hidden"
                        name="status"
                        value={request.status === "open" ? "resolved" : "open"}
                      />
                      <button type="submit" className="font-medium text-ink-500 hover:text-ink-800">
                        {request.status === "open" ? "Mark resolved" : "Reopen"}
                      </button>
                    </form>
                  ) : null
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
