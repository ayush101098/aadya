import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  loadHelpRequests,
  loadOpportunities,
  loadPeople,
  loadResources,
} from "@/lib/data";
import { byNewest } from "@/lib/data/filters";
import {
  adminDeleteAction,
  adminRemoveMemberAction,
  adminSetRoleAction,
  toggleOpportunityStatusAction,
} from "@/app/actions";
import { Collapsible } from "@/components/Collapsible";
import { AddMemberForm } from "@/components/AddMemberForm";
import { relativeTime } from "@/lib/format";

function DeleteButton({ table, id }: { table: string; id: string }) {
  return (
    <form action={adminDeleteAction}>
      <input type="hidden" name="table" value={table} />
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="text-xs font-medium text-red-600 hover:text-red-700">
        Delete
      </button>
    </form>
  );
}

export default async function AdminPage() {
  const admin = await requireAdmin();
  const [people, resources, opportunities, helpRequests] = await Promise.all([
    loadPeople(),
    loadResources(),
    loadOpportunities(),
    loadHelpRequests(),
  ]);
  const byId = new Map(people.map((p) => [p.id, p]));

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold tracking-tight text-ink-950">Admin</h1>
          <p className="text-sm text-ink-600">
            Manage cohort members and moderate what gets posted.
          </p>
        </div>
        <Collapsible label="Add member">
          <AddMemberForm />
        </Collapsible>
      </header>

      <section className="card overflow-hidden">
        <div className="border-b border-ink-200 px-4 py-3">
          <h2 className="text-sm font-semibold text-ink-950">
            Members <span className="text-ink-400">({people.length})</span>
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Email</th>
                <th className="px-4 py-2 text-left font-semibold">Location</th>
                <th className="px-4 py-2 text-left font-semibold">Role</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {people.map((person) => (
                <tr key={person.id}>
                  <td className="px-4 py-2">
                    <Link href={`/people/${person.id}`} className="font-medium hover:text-accent-700">
                      {person.name}
                    </Link>
                  </td>
                  <td className="px-4 py-2 text-ink-600">{person.email}</td>
                  <td className="px-4 py-2 text-ink-600">{person.location || "—"}</td>
                  <td className="px-4 py-2">
                    <form action={adminSetRoleAction} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={person.id} />
                      <input
                        type="hidden"
                        name="role"
                        value={person.role === "admin" ? "student" : "admin"}
                      />
                      <span className="tag">{person.role}</span>
                      {person.id !== admin.id && (
                        <button type="submit" className="text-xs text-accent-700 hover:underline">
                          {person.role === "admin" ? "Make student" : "Make admin"}
                        </button>
                      )}
                    </form>
                  </td>
                  <td className="px-4 py-2 text-right">
                    {person.id !== admin.id && (
                      <form action={adminRemoveMemberAction}>
                        <input type="hidden" name="id" value={person.id} />
                        <button
                          type="submit"
                          className="text-xs font-medium text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <div className="card p-4">
          <h2 className="section-title">Resources ({resources.length})</h2>
          <ul className="mt-3 space-y-2.5">
            {[...resources].sort(byNewest).map((resource) => (
              <li key={resource.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-900">{resource.title}</p>
                  <p className="truncate text-xs text-ink-500">
                    {byId.get(resource.uploadedBy)?.name ?? "Unknown"} ·{" "}
                    {relativeTime(resource.createdAt)}
                  </p>
                </div>
                <DeleteButton table="resources" id={resource.id} />
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="section-title">Opportunities ({opportunities.length})</h2>
          <ul className="mt-3 space-y-2.5">
            {[...opportunities].sort(byNewest).map((opportunity) => (
              <li key={opportunity.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-900">{opportunity.title}</p>
                  <p className="truncate text-xs text-ink-500">
                    {byId.get(opportunity.postedBy)?.name ?? "Unknown"} · {opportunity.status}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <form action={toggleOpportunityStatusAction}>
                    <input type="hidden" name="id" value={opportunity.id} />
                    <input type="hidden" name="postedBy" value={opportunity.postedBy} />
                    <input
                      type="hidden"
                      name="status"
                      value={opportunity.status === "open" ? "closed" : "open"}
                    />
                    <button type="submit" className="text-xs text-accent-700 hover:underline">
                      {opportunity.status === "open" ? "Close" : "Reopen"}
                    </button>
                  </form>
                  <DeleteButton table="opportunities" id={opportunity.id} />
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="card p-4">
          <h2 className="section-title">Help requests ({helpRequests.length})</h2>
          <ul className="mt-3 space-y-2.5">
            {[...helpRequests].sort(byNewest).map((request) => (
              <li key={request.id} className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm text-ink-900">{request.title}</p>
                  <p className="truncate text-xs text-ink-500">
                    {byId.get(request.postedBy)?.name ?? "Unknown"} · {request.status}
                  </p>
                </div>
                <DeleteButton table="help_requests" id={request.id} />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
