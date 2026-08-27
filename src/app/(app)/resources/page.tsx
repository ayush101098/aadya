import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { loadPeople, loadResources } from "@/lib/data";
import { byNewest, filterResources } from "@/lib/data/filters";
import { FilterBar } from "@/components/FilterBar";
import { ResourceCard } from "@/components/cards";
import { EmptyState } from "@/components/EmptyState";
import { Collapsible } from "@/components/Collapsible";
import { AddResourceForm } from "@/components/forms";
import { RESOURCE_CATEGORIES } from "@/lib/taxonomy";
import { one, type SearchParams } from "@/lib/params";

export default async function ResourcesPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getCurrentUser();
  const params = await searchParams;
  const [resources, people] = await Promise.all([loadResources(), loadPeople()]);
  const byId = new Map(people.map((p) => [p.id, p]));

  const results = filterResources(resources, {
    q: one(params, "q"),
    category: one(params, "category"),
  }).sort(byNewest);

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink-950">Resources</h1>
          <p className="text-sm text-ink-600">
            Notes, guides, templates and courses shared by the cohort.
          </p>
        </div>
        {user ? (
          <Collapsible label="Share a resource" defaultOpen={one(params, "new") === "1"}>
            <AddResourceForm />
          </Collapsible>
        ) : (
          <Link href="/login" className="btn-secondary">
            Sign in to post
          </Link>
        )}
      </header>

      <FilterBar
        placeholder="Title, description, tag..."
        resultCount={results.length}
        filters={[{ name: "category", label: "Category", options: RESOURCE_CATEGORIES }]}
      />

      {results.length === 0 ? (
        <EmptyState
          title="No resources match that yet."
          hint="Clear the filters, or be the first to share something on this topic."
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {results.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              uploader={byId.get(resource.uploadedBy)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
