import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getPerson,
  loadHelpRequests,
  loadOpportunities,
  loadResources,
} from "@/lib/data";
import { personFunctions, personIndustries } from "@/lib/data/filters";
import { Avatar } from "@/components/Avatar";
import { TagList } from "@/components/Tag";
import { ConnectButton } from "@/components/ConnectButton";
import { HelpRequestCard, OpportunityCard, ResourceCard } from "@/components/cards";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="card p-4">
      <h2 className="section-title">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const viewer = await requireUser();
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();

  const [resources, opportunities, helpRequests] = await Promise.all([
    loadResources(),
    loadOpportunities(),
    loadHelpRequests(),
  ]);

  const theirResources = resources.filter((r) => r.uploadedBy === person.id);
  const theirOpportunities = opportunities.filter((o) => o.postedBy === person.id);
  const theirAsks = helpRequests.filter((h) => h.postedBy === person.id);

  return (
    <div className="space-y-4">
      <Link href="/people" className="text-xs font-medium text-accent-700">
        ← Back to directory
      </Link>

      <header className="card p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <Avatar name={person.name} photo={person.photo} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight text-ink-950">{person.name}</h1>
            <p className="text-sm text-ink-700">{person.currentRole}</p>
            {person.group && (
              <p className="mt-1.5">
                <Link href={`/people?group=${encodeURIComponent(person.group)}`} className="tag-amber">
                  {person.group}
                </Link>
              </p>
            )}
            <p className="mt-0.5 text-sm text-ink-500">
              {person.location}
              {person.role === "admin" && (
                <span className="ml-2 tag bg-accent-50 text-accent-700">Admin</span>
              )}
            </p>
            {person.bio && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-700">{person.bio}</p>}
          </div>
          <div className="sm:w-64 sm:shrink-0">
            {viewer.id === person.id ? (
              <Link href="/profile" className="btn-secondary w-full">
                Edit my profile
              </Link>
            ) : (
              <ConnectButton
                name={person.name}
                preference={person.contactPreference}
                handle={person.contactHandle}
                linkedinUrl={person.linkedinUrl}
              />
            )}
          </div>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Section title="Experience">
          {person.experience.length === 0 ? (
            <p className="text-sm text-ink-500">Not filled in yet.</p>
          ) : (
            <ul className="space-y-3">
              {person.experience.map((item) => (
                <li key={item.id} className="flex items-baseline justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-ink-900">{item.company}</p>
                    <p className="text-xs text-ink-500">
                      {[item.industry, item.function].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-ink-500">
                    {item.years} {item.years === 1 ? "yr" : "yrs"}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-4 space-y-2">
            <p className="label">Industries</p>
            <TagList
              items={personIndustries(person)}
              hrefFor={(i) => `/people?industry=${encodeURIComponent(i)}`}
            />
            <p className="label pt-2">Functions</p>
            <TagList
              items={personFunctions(person)}
              hrefFor={(f) => `/people?function=${encodeURIComponent(f)}`}
            />
          </div>
        </Section>

        <div className="space-y-4">
          <Section title="Can help with">
            {person.skills.length ? (
              <TagList
                items={person.skills}
                accent
                hrefFor={(s) => `/people?skill=${encodeURIComponent(s)}`}
              />
            ) : (
              <p className="text-sm text-ink-500">Not filled in yet.</p>
            )}
          </Section>

          <Section title="Interested in">
            {person.interests.length ? (
              <TagList
                items={person.interests}
                hrefFor={(i) => `/people?interest=${encodeURIComponent(i)}`}
              />
            ) : (
              <p className="text-sm text-ink-500">Not filled in yet.</p>
            )}
          </Section>

          <Section title="Looking for">
            {person.lookingFor.length ? (
              <TagList
                items={person.lookingFor}
                hrefFor={(l) => `/people?lookingFor=${encodeURIComponent(l)}`}
              />
            ) : (
              <p className="text-sm text-ink-500">Not filled in yet.</p>
            )}
          </Section>
        </div>
      </div>

      {theirResources.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">Shared by {person.name.split(" ")[0]}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {theirResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} uploader={person} />
            ))}
          </div>
        </section>
      )}

      {theirOpportunities.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">Opportunities posted</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {theirOpportunities.map((opportunity) => (
              <OpportunityCard key={opportunity.id} opportunity={opportunity} poster={person} />
            ))}
          </div>
        </section>
      )}

      {theirAsks.length > 0 && (
        <section className="space-y-3">
          <h2 className="section-title">Open requests</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {theirAsks.map((request) => (
              <HelpRequestCard key={request.id} request={request} poster={person} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
